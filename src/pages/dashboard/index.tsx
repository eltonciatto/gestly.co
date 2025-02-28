import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';

// Dashboard pages
import Overview from './overview';
import Appointments from './appointments';
import AppointmentDetails from './appointments/details';
import NewAppointment from './appointments/new';
import Customers from './customers';
import NewCustomer from './customers/new';
import CustomerDetails from './customers/[id]';
import Services from './services';
import NewService from './services/new';
import ServiceDetails from './services/details';
import Reviews from './reviews';
import Reports from './reports';

// Finance pages
import CashFlow from './finance';
import Receivables from './finance/receivables';
import Payables from './finance/payables';
import BankIntegration from './finance/bank';
import FinancialReports from './finance/reports';

// Commission pages
import Commissions from './commissions';
import CommissionGoals from './commissions/goals';
import CommissionPayments from './commissions/payments';
import CommissionDashboard from './commissions/dashboard';
import CommissionSettings from './commissions/settings';

// Settings pages
import Settings from './settings';
import BusinessSettings from './settings/business';
import BusinessHours from './settings/business-hours';
import SpecialDays from './settings/business-hours/special-days';
import Notifications from './settings/notifications';
import Integrations from './settings/integrations';
import APISettings from './settings/api';
import APIDocs from './settings/api-docs';
import Team from './settings/team';
import LoyaltySettings from './settings/loyalty';

// Admin pages
import AdminDashboard from './admin';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        {/* Main dashboard */}
        <Route index element={<Overview />} />
        
        {/* Appointments */}
        <Route path="appointments">
          <Route index element={<Appointments />} />
          <Route path="new" element={<NewAppointment />} />
          <Route path=":id" element={<AppointmentDetails />} />
        </Route>

        {/* Customers */}
        <Route path="customers">
          <Route index element={<Customers />} />
          <Route path="new" element={<NewCustomer />} />
          <Route path=":id" element={<CustomerDetails />} />
        </Route>

        {/* Services */}
        <Route path="services">
          <Route index element={<Services />} />
          <Route path="new" element={<NewService />} />
          <Route path=":id" element={<ServiceDetails />} />
        </Route>

        {/* Reviews */}
        <Route path="reviews" element={<Reviews />} />

        {/* Reports */}
        <Route path="reports" element={<Reports />} />

        {/* Finance */}
        <Route path="finance">
          <Route index element={<CashFlow />} />
          <Route path="receivables" element={<Receivables />} />
          <Route path="payables" element={<Payables />} />
          <Route path="bank" element={<BankIntegration />} />
          <Route path="reports" element={<FinancialReports />} />
        </Route>

        {/* Commissions */}
        <Route path="commissions">
          <Route index element={<Commissions />} />
          <Route path="goals" element={<CommissionGoals />} />
          <Route path="payments" element={<CommissionPayments />} />
          <Route path="dashboard" element={<CommissionDashboard />} />
          <Route path="settings" element={<CommissionSettings />} />
        </Route>

        {/* Settings */}
        <Route path="settings">
          <Route index element={<Settings />} />
          <Route path="business" element={<BusinessSettings />} />
          <Route path="business-hours">
            <Route index element={<BusinessHours />} />
            <Route path="special-days" element={<SpecialDays />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="api">
            <Route index element={<APISettings />} />
            <Route path="docs" element={<APIDocs />} />
          </Route>
          <Route path="team" element={<Team />} />
          <Route path="loyalty" element={<LoyaltySettings />} />
        </Route>

        {/* Admin */}
        <Route path="admin" element={<AdminDashboard />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}