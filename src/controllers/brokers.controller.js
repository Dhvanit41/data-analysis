const { sequelize } = require('../models/index');
const chartConfig = require('../config/config.js');

const healthcheck = (req, res) => {
  res.sendStatus(200);
};

async function getTrend(req, res) {
  try {
    const [brokers, newListing, chartTableData] = await Promise.all([
      sequelize.query(`select s.title, date_trunc('month', dh.date) as "month", count(dh.id) as count,
 round(avg(dh.revenue),2) as revenue from public.sites s inner join public.deals d on d.site_id = s.id 
inner join deals_history 
dh on dh.deal_id = d.id group by month,
 s.title;
`),

      sequelize.query(`select s.title, date_trunc('month', dh.date) as "month", count(dh.id) as count from sites s 
left join deals_history dh on dh.site_id = s.id  where status = 'New Listing' group by s.title, month;
`),

      sequelize.query(
        `select
	deal_id as id,
	date_part('month',date_trunc('month', dh.date)) as "month" ,
	date_part('year',date_trunc('month', dh.date)) as "year",
	date,
	s.title as broker,
	dh.revenue as revenue
from
	deals_history dh
join sites s on
	s.id = dh.site_id `
      ),
    ]);

    const preparedData = prepareData(
      brokers && brokers.length ? brokers[0] : []
    );
    const preparedDataFronewListing = prepareData(
      newListing && newListing.length ? newListing[0] : [],
      true
    );
    res.render('home', {
      chart: {
        chartData: JSON.stringify(preparedData),
        xAxisDates: Object.keys(
          getXAxisDates(chartConfig.chart.start, chartConfig.chart.end)
        ),
        newListingChartData: JSON.stringify(preparedDataFronewListing),
        chartTableData: JSON.stringify(chartTableData[0]),
        newListingChartTableData: JSON.stringify(newListing[0]),
      },
    });
  } catch (e) {
    console.log(e);
    return res.send({
      status: false,
      error: e.message,
    });
  }
}

function prepareData(brokers, count = false) {
  const responseData = [];
  const distinctBrokers = [...new Set([...brokers.map((b) => b.title)])];
  for (const singleBroker of distinctBrokers) {
    let xAxisDates = getXAxisDates(
      chartConfig.chart.start,
      chartConfig.chart.end
    );
    for (const bdata of brokers) {
      if (bdata.title == singleBroker) {
        const dateObj = new Date(bdata.month);
        const month = dateObj.getUTCMonth() + 1;
        const year = dateObj.getUTCFullYear();
        const newdate = month + '-' + year;
        xAxisDates[newdate] = count ? bdata.count : bdata.revenue;
      }
    }
    xAxisDates = { ...fillMissingValues(xAxisDates) };
    responseData.push({
      broker: singleBroker,
      valueByMonth: xAxisDates,
    });
  }
  return responseData;
}

function getXAxisDates(start, end) {
  let obj = {};
  start = new Date(start);
  end = new Date(end);
  while (start <= end) {
    const month = start.getUTCMonth() + 1; //months from 1-12
    const year = start.getUTCFullYear();
    const newdate = month + '-' + year;
    obj[newdate] = false;
    start.setMonth(start.getMonth() + 1);
  }
  return { ...obj };
}

function fillMissingValues(dates) {
  Object.keys(dates).forEach((date) => {
    if (dates[date] == false) {
      dates[date] = 0;
    }
  });
  return dates;
}

module.exports = {
  healthcheck,
  getTrend,
};
