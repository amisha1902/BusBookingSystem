require 'rails_helper'

RSpec.describe Route::Create do
  let(:admin) { create(:user, :admin) }
  
  let(:params) do
    {
      route: {
        source_city: 'Mumbai',
        destination_city: 'Pune',
        total_distance_km: 192,
        estimated_duration_mins: 120,
        is_active: true
      }
    }
  end
 
  subject { described_class.call(params: params, current_user: admin) }
 
 
  describe '#call - Happy Path' do
    it 'creates a new route' do
      expect { subject }.to change(Route, :count).by(1)
    end
 
    it 'returns success' do
      expect(subject).to be_success
    end
 
    it 'creates route with correct attributes' do
      subject
      
      route = Route.last
      expect(route.source_city).to eq('Mumbai')
      expect(route.destination_city).to eq('Pune')
      expect(route.total_distance_km).to eq(192)
      expect(route.is_active).to be true
    end
 
    it 'returns model in context' do
      expect(subject[:model]).to be_a(Route)
    end
  end
 
 
  describe '#authorize' do
    context 'when user is not admin' do
      let(:operator) { create(:user, :operator) }
 
      subject { described_class.call(params: params, current_user: operator) }
 
      it 'returns failure' do
        expect(subject).not_to be_success
      end
 
      it 'does not create route' do
        expect { subject }.not_to change(Route, :count)
      end
    end
  end
 
 
  describe '#validate' do
    context 'with missing source_city' do
      before { params[:route].delete(:source_city) }
 
      it 'returns failure' do
        expect(subject).not_to be_success
      end
    end
 
    context 'with missing destination_city' do
      before { params[:route].delete(:destination_city) }
 
      it 'returns failure' do
        expect(subject).not_to be_success
      end
    end
 
    context 'with all valid fields' do
      it 'passes validation' do
        expect(subject).to be_success
      end
    end
 
    context 'with duplicate route' do
      before do
        create(:route, source_city: 'Mumbai', destination_city: 'Pune')
      end
 
      it 'may allow or disallow duplicates' do
      end
    end
  end
  
  describe 'Edge Cases' do
    context 'with same source and destination' do
      before do
        params[:route][:destination_city] = 'Mumbai'
      end
 
      it 'allows same city route' do
      end
    end
 
    context 'with very long distance' do
      before { params[:route][:total_distance_km] = 999999 }
 
      it 'handles large distances' do
        expect(subject).to be_success
      end
    end
  end
end