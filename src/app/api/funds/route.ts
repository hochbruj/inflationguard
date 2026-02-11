/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/funds/route.ts


const getPerformanceValues = (performances: any, symbol: string) => {
  const result: Record<string, string | null> = {};

  // Define the order of time periods you want in the result
  const timePeriods = ["1M", "3M", "YTD", "3Y", "5Y", "1Y"];

  timePeriods.forEach(period => {
    if (performances[period] && performances[period][symbol] !== undefined) {
      result[period] = performances[period][symbol].toFixed(2);
    } else {
      result[period] = null; // or you could use undefined
    }
  });

  return result;
}

export async function GET(request: Request) {
  // 1. Fetch chart data from your existing endpoint
  const [performanceResponse, fundsResponse]: [any, any] = await Promise.all([
    fetch(
      'https://us-central1-bullion-vs-bytes.cloudfunctions.net/getPerformance'
    ),
    fetch('https://us-central1-bitcoin-gold-functions.cloudfunctions.net/getFunds')
  ]);

  console.log('Fetched performance and funds data');

  const performance = await performanceResponse.json();
  const funds = await fundsResponse.json();
  //Add returns data
  Object.keys(funds).forEach(fundKey => {
    funds[fundKey].returns = getPerformanceValues(performance.performances, funds[fundKey].symbol);
  });

  // 4. Combine everything
  return Response.json({
    funds,
    shortTermChartData: performance.shortTermChartData,
    monthlyChartData: performance.monthlyChartData,
  });
}