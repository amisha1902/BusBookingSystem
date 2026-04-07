require "rails_helper"

RSpec.describe BusOperator::Create do
  let(:operator_user) { create(:user, :operator) }

  let(:params) do
    ActionController::Parameters.new(
      bus_operator: {
        company_name: "Express Travels",
        license_no: "LN-12345678",
        contact_email: "contact@express.com",
      },
    )
  end

  subject { described_class.call(params: params, current_user: operator_user) }

  describe "#call - Happy Path" do
    it "creates a new bus operator" do
      expect { subject }.to change(BusOperator, :count).by(1)
    end

    it "returns success" do
      expect(subject).to be_success
    end

    it "creates operator with correct attributes" do
      subject

      bus_op = BusOperator.last
      expect(bus_op.company_name).to eq("Express Travels")
      expect(bus_op.license_no).to eq("LN-12345678")
      expect(bus_op.contact_email).to eq("contact@express.com")
    end

    it "associates operator with current user" do
      subject

      bus_op = BusOperator.last
      expect(bus_op.user_id).to eq(operator_user.id)
    end

    it "marks operator as not verified" do
      subject

      bus_op = BusOperator.last
      expect(bus_op.is_verified).to be false
    end

    it "returns model in context" do
      expect(subject[:model]).to be_a(BusOperator)
    end
  end

  describe "#authorize_user" do
    context "when user is passenger" do
      let(:passenger) { create(:user, :passenger) }

      subject { described_class.call(params: params, current_user: passenger) }

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "does not create operator" do
        expect { subject }.not_to change(BusOperator, :count)
      end

      it "has authorization error" do
        subject

        expect(subject[:model].errors[:base].first).to include("Only operators can")
      end
    end

    context "when user is admin" do
      let(:admin) { create(:user, :admin) }

      subject { described_class.call(params: params, current_user: admin) }

      it "returns failure" do
        expect(subject).not_to be_success
      end
    end
  end

  describe "#assign_attributes" do
    context "with valid permitted parameters" do
      it "assigns all attributes" do
        subject

        bus_op = BusOperator.last
        expect(bus_op.company_name).to be_present
        expect(bus_op.license_no).to be_present
      end
    end

    context "with extra parameters" do
      before do
        params[:bus_operator][:extra_field] = "should be ignored"
      end

      it "ignores non-permitted fields" do
        expect(subject).to be_success
      end
    end

    context "with missing company_name" do
      before { params[:bus_operator].delete(:company_name) }

      it "fails at validation" do
        expect(subject).not_to be_success
      end
    end
  end

  describe "#validate_model" do
    context "with duplicate license_no" do
      before do
        create(:bus_operator, license_no: "LN-12345678")
      end

      it "returns failure" do
        expect(subject).not_to be_success
      end

      it "has validation error" do
        subject

        expect(subject[:model].errors[:license_no]).to be_present
      end
    end

    context "with all valid data" do
      it "passes validation" do
        expect(subject).to be_success
      end
    end
  end

  # ==================== EDGE CASES ====================

  describe "Edge Cases" do
    context "with very long company name" do
      before { params[:bus_operator][:company_name] = "A" * 255 }

      it "handles long names" do
        # Depends on column limit
      end
    end

    it "allows user to create multiple operators" do
      create(:bus_operator, user: operator_user)

      new_params = ActionController::Parameters.new(
        bus_operator: {
          company_name: "XYZ Travels",
          license_no: "LIC999",
          contact_email: "contact@xyz.com"
        },
      )
      expect {
        described_class.call(params: new_params, current_user: operator_user)
      }.to change(BusOperator, :count).by(1)
    end
  end
end
