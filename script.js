// 데이터를 API에서 가져오는 함수
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// 월간 위험 감지 차트
async function drawMonthlyRiskChart(email) {
  const data = await fetchData(`/api/month-detected?email=${email}`);
  if (!data) return;

  // 데이터 처리
  const labels = data.map((item) => item.detected_date);
  const values = data.map((item) => item.daily_count);

  const ctx = document.getElementById("monthlyRiskChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "월간 위험 감지",
          data: values,
          borderColor: "#818cf8",
          backgroundColor: "rgba(129, 140, 248, 0.2)",
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: "#333" },
        },
        y: {
          ticks: { color: "#333" },
          beginAtZero: true,
        },
      },
    },
  });
}

// 유형별 민감 정보 차트
async function drawSensitiveInfoChart(email) {
  const data = await fetchData(`/api/sensitive-info?email=${email}`);
  if (!data) return;

  // 데이터 처리
  const labels = data.map((item) => item.content_type);
  const values = data.map((item) => item.count);

  const ctx = document.getElementById("sensitiveInfoChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: ["#818cf8", "#f87171", "#fbbf24", "#34d399"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#333",
            font: { size: 12 },
          },
        },
      },
    },
  });
}

// 페이지 로드 시 차트 생성
document.addEventListener("DOMContentLoaded", () => {
  const email = "bblue6@naver.com"; // 테스트용 이메일

  drawMonthlyRiskChart(email);
  drawSensitiveInfoChart(email);
});
