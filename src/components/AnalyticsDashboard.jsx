import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import "./css/AnalyticsDashboard.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("http://localhost:8000/api/schedules/analytics");
        console.log("Analytics Data Response:", response.data);
        if (!response.data || Object.keys(response.data).length === 0) {
          setError("No analytics data available.");
        } else {
          setAnalyticsData(response.data);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError("Failed to fetch analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <p>Loading analytics data...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!analyticsData) {
    return <p>No analytics data available.</p>;
  }

  // Chart data for Classes per Professor (Bar Chart)
  const professorChartData = {
    labels: analyticsData.classesPerProfessor.map(item => item.professor),
    datasets: [
      {
        label: "Number of Classes",
        data: analyticsData.classesPerProfessor.map(item => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  };

  // Chart data for Classes per Group (Bar Chart)
  const groupChartData = {
    labels: analyticsData.classesPerGroup.map(item => `Group ${item.group}`),
    datasets: [
      {
        label: "Number of Classes",
        data: analyticsData.classesPerGroup.map(item => item.count),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1
      }
    ]
  };

  // Chart data for Classes per Day (Bar Chart)
  const dayChartData = {
    labels: analyticsData.classesPerDay.map(item => item.day),
    datasets: [
      {
        label: "Number of Classes",
        data: analyticsData.classesPerDay.map(item => item.count),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1
      }
    ]
  };

  // Chart data for Subject Distribution (Pie Chart)
  const subjectChartData = {
    labels: analyticsData.subjectDistribution.map(item => item.subject),
    datasets: [
      {
        label: "Number of Classes",
        data: analyticsData.subjectDistribution.map(item => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }
    ]
  };

  // Chart data for Classes per Professor per Group (Bar Chart)
  const professorPerGroupChartData = {
    labels: analyticsData.classesPerProfessorPerGroup.map(item => `${item.professor} (Group ${item.groupNo})`),
    datasets: [
      {
        label: "Number of Classes",
        data: analyticsData.classesPerProfessorPerGroup.map(item => item.count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Scheduling Analytics"
      }
    }
  };

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>
      <div className="charts-container">
        <div className="chart">
          <h3>Classes per Professor</h3>
          <Bar data={professorChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Classes per Professor" } } }} />
        </div>
        <div className="chart">
          <h3>Classes per Group</h3>
          <Bar data={groupChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Classes per Group" } } }} />
        </div>
        <div className="chart">
          <h3>Classes per Day</h3>
          <Bar data={dayChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Classes per Day" } } }} />
        </div>
        <div className="chart">
          <h3>Subject Distribution</h3>
          <Pie data={subjectChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Subject Distribution" } } }} />
        </div>
        <div className="chart">
          <h3>Classes per Professor per Group</h3>
          <Bar data={professorPerGroupChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { ...chartOptions.plugins.title, text: "Classes per Professor per Group" } } }} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;