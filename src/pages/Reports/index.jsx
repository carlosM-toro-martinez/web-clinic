import React from "react";
import LayoutComponent from "../../components/LayoutComponent";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import ReportsNext from "./ReportsNext";
import ReportsDashboard from "../../components/ReportsDashboard";

function Reports() {
  return (
    <LayoutComponent>
      {/* <ReportsNext /> */}
      <ReportsDashboard />
    </LayoutComponent>
  );
}

export default Reports;
