require "rails_helper"

RSpec.describe Bus::Create do
  let(:operator_user) { create(:user, :operator) }
  let(:bus_operator) { create(:bus_operator, user: operator_user) }

  let(:params) do
    ActionController::Parameters.new(
      bus: {
        bus_no: "MH-01-AB-1234",
        bus_name: "Express Bus",
        bus_type: "ac_seater",
        deck: 1
      }
    )
  end

  subject do
    described_class.call(
      params: params,
      current_user: operator_user,
      bus_operator: bus_operator
    )
  end


  describe "#call - Happy Path" do
    it "creates a new bus" do
      expect { subject }.to change(Bus, :count).by(1)
    end

    it "returns success" do
      expect(subject).to be_success
    end

    it "creates bus with correct attributes" do
      subject

      bus = Bus.last
      expect(bus.bus_no).to eq("MH-01-AB-1234")
      expect(bus.bus_name).to eq("Express Bus")
      expect(bus.bus_type).to eq("ac_seater")
      expect(bus.deck).to eq(1)
    end

    it "associates bus with bus operator" do
      subject

      bus = Bus.last
      expect(bus.bus_operator_id).to eq(bus_operator.id)
    end

    it "generates seats for the bus" do
      expect { subject }.to change(Seat, :count)
    end

    it "calculates correct total seats" do
      subject

      bus = Bus.last
      expect(bus.total_seats).to be > 0
    end

    it "marks bus as active by default" do
      subject

      bus = Bus.last
      expect(bus.is_active).to be true
    end

    it "returns model in context" do
      expect(subject[:model]).to be_a(Bus)
    end
  end


  describe "#build_model" do
    it "initializes empty bus" do
      subject

      expect(subject[:model]).to be_a(Bus)
    end
  end



  describe "#assign_bus_operator" do
    context "with missing bus_operator" do
      subject do
        described_class.call(
          params: params,
          current_user: operator_user,
          bus_operator: nil
        )
      end

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "has error about missing operator" do
        subject
        expect(subject[:model].errors[:base]).to be_present
      end

      it "does not create bus" do
        expect { subject }.not_to change(Bus, :count)
      end
    end

    it "sets correct bus_operator" do
      subject

      bus = Bus.last
      expect(bus.bus_operator).to eq(bus_operator)
    end
  end

  describe "#authorize_user" do
    context "when user is not operator" do
      let(:passenger) { create(:user, :passenger) }

      subject do
        described_class.call(
          params: params,
          current_user: passenger,
          bus_operator: bus_operator
        )
      end

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "does not create bus" do
        expect { subject }.not_to change(Bus, :count)
      end
    end

    context "when operator does not own bus_operator" do
      let(:other_operator) { create(:user, :operator) }
      let(:other_bus_operator) { create(:bus_operator, user: other_operator) }

      subject do
        described_class.call(
          params: params,
          current_user: operator_user,
          bus_operator: other_bus_operator
        )
      end

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "has permission error" do
        subject
        expect(subject[:model].errors[:base].first).to include("do not have permission")
      end

      it "does not create bus" do
        expect { subject }.not_to change(Bus, :count)
      end
    end
  end

  describe "#assign_attributes" do
    context "with all valid attributes" do
      it "assigns all parameters" do
        subject

        bus = Bus.last
        expect(bus.bus_no).to eq(params[:bus][:bus_no])
      end
    end

    context "with missing bus_no" do
      before { params[:bus].delete(:bus_no) }

      it "fails validation later" do
        subject
        expect(subject).not_to be_success
        expect(subject[:model].errors[:bus_no]).to be_present
      end
    end

    context "with nil values" do
      before { params[:bus][:bus_name] = nil }

      it "keeps nil value for validation" do
        subject
        expect(subject[:model].bus_name).to be_nil
      end
    end

    context "with empty string values" do
      before { params[:bus][:bus_type] = "" }

      it "fails validation" do
        expect(subject).not_to be_success
      end
    end

    context "with missing deck parameter" do
      before { params[:bus].delete(:deck) }

      it "defaults to 1" do
        subject

        bus = Bus.last
        expect(bus.deck).to eq(1)
      end
    end

    context "with deck as string" do
      before { params[:bus][:deck] = "2" }

      it "converts to integer" do
        subject

        bus = Bus.last
        expect(bus.deck).to eq(2)
        expect(bus.deck).to be_a(Integer)
      end
    end

    context "with invalid parameter keys" do
      before { params[:bus][:invalid_field] = "ignored" }

      it "ignores extra parameters" do
        expect(subject).to be_success
      end
    end

    context "when parameter processing fails" do
      before do
        allow(params[:bus]).to receive(:permit).and_raise(StandardError, "Param error")
      end

      it "returns failure" do
        expect(subject).not_to be_success
      end
    end
  end

  describe "#calculate_total_seats" do
    context "with valid bus_type" do
      it "calculates seats correctly" do
        subject

        bus = Bus.last
        expect(bus.total_seats).to be > 0
      end
    end

    context "with invalid bus_type" do
      before { params[:bus][:bus_type] = "invalid_type" }

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "does not create bus" do
        expect { subject }.not_to change(Bus, :count)
      end
    end

    context "with multiple decks" do
      before { params[:bus][:deck] = 2 }

      it "multiplies seats by deck count" do
        subject

        bus = Bus.last
        layout = SeatLayoutGenerator::SEAT_LAYOUTS[bus.bus_type.to_sym]

        expected = layout[:rows] * layout[:cols] * 2
        expect(bus.total_seats).to eq(expected)
      end
    end
  end

  describe "#generate_seats" do
    it "creates seats for the bus" do
      expect { subject }.to change(Seat, :count)
    end

    it "creates correct number of seats" do
      subject

      bus = Bus.last
      seat_count = Seat.where(bus_id: bus.id).count
      expect(seat_count).to eq(bus.total_seats)
    end

    context "when seat generation fails" do
      before do
        allow(SeatLayoutGenerator).to receive(:generate_for_bus).and_raise(StandardError, "Seat error")
      end

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "adds seat generation error" do
        subject
        expect(subject[:model].errors[:base].first).to include("Failed to generate seats")
      end
    end
  end

  describe "#validate_model" do
    context "with duplicate bus_no" do
      before do
        create(:bus, bus_no: "MH-01-AB-1234")
      end

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "has validation error" do
        subject
        expect(subject[:model].errors[:bus_no]).to be_present
      end
    end

    context "with valid fields" do
      it "passes validation" do
        expect(subject).to be_success
      end
    end
  end

  describe "Edge Cases" do
    context "with very long bus name" do
      before { params[:bus][:bus_name] = "A" * 255 }

      it "handles long names" do
        subject
        bus = Bus.last
        expect(bus.bus_name.length).to eq(255)
      end
    end

    context "with special characters in bus_no" do
      before { params[:bus][:bus_no] = "MH-01-AB-@#$%" }

      it "allows special characters" do
        expect(subject).to be_success
      end
    end

    context "with deck value of 0" do
      before { params[:bus][:deck] = 0 }

      it "is invalid" do
        expect(subject).not_to be_success
      end
    end

    context "with negative deck value" do
      before { params[:bus][:deck] = -1 }

      it "rejects negative deck" do
        expect(subject).not_to be_success
      end
    end

    context "with very high deck count" do
      before { params[:bus][:deck] = 100 }

      it "calculates large seat count" do
        subject

        bus = Bus.last
        expect(bus.total_seats).to be > 1000
      end
    end
  end

  describe "Integration Tests" do
    it "creates bus and seats together" do
      expect { subject }
        .to change(Bus, :count).by(1)
        .and change(Seat, :count)
    end

    it "bus has correct associations" do
      subject

      bus = Bus.last
      expect(bus.bus_operator).to eq(bus_operator)
      expect(bus.seats.count).to eq(bus.total_seats)
    end
  end
end
