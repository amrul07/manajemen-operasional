import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import useConfig from '../../../hooks/useConfig';
import SkeletonTotalGrowthBarChart from '../../../ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from '../../../ui-component/cards/MainCard';
import { gridSpacing } from '../../../store/constant';

// chart data
import barChartOptions from './chart-data/total-growth-bar-chart';
import { Poppins } from '../../../ui-component/typography/Poppins';
import DashboardLogic from './DashboardLogic';

const status = [
  { value: 'today', label: 'Today' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
];

export default function TotalBarangMasukKeluar({ isLoading }) {
  const { value } = DashboardLogic();
  const theme = useTheme();
  const {
    state: { fontFamily }
  } = useConfig();

  // const [value, setValue] = useState('today');
  const [chartOptions, setChartOptions] = useState(barChartOptions);

  const textPrimary = theme.vars.palette.text.primary;
  const divider = theme.vars.palette.divider;
  const grey500 = theme.vars.palette.grey[500];

  const primary200 = theme.vars.palette.primary[200];
  const primaryDark = theme.vars.palette.primary.dark;
  const secondaryMain = theme.vars.palette.secondary.main;
  const secondaryLight = theme.vars.palette.secondary.light;

  const warningDark = theme.vars.palette.warning.dark;

  useEffect(() => {
    setChartOptions({
      ...barChartOptions,
      chart: { ...barChartOptions.chart, fontFamily: `'Poppins', sans-serif` },
      colors: [warningDark, primaryDark, secondaryMain, secondaryLight],
      xaxis: { ...barChartOptions.xaxis, labels: { style: { colors: textPrimary } } },
      yaxis: { ...barChartOptions.yaxis, labels: { style: { colors: textPrimary } } },
      grid: { borderColor: divider },
      tooltip: { theme: 'light' },
      legend: { ...(barChartOptions.legend ?? {}), labels: { ...(barChartOptions.legend?.labels ?? {}), colors: grey500 } }
    });
  }, [fontFamily, warningDark, primaryDark, secondaryMain, secondaryLight, textPrimary, grey500, divider]);

  const series = Array.isArray(value?.dataChart) ? value.dataChart : [];

  return (
    <>
      {value.loadingGet ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Stack sx={{ gap: gridSpacing }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack sx={{ gap: 1 }}>
                <Poppins variant="subtitle2">Total Barang Masuk & Keluar</Poppins>
                {/* <Poppins variant="h3">$2,324.00</Poppins> */}
              </Stack>
              {/* <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                {status.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField> */}
            </Stack>
            <Box
              sx={{
                ...theme.applyStyles('light', {
                  '& .apexcharts-series:nth-of-type(4) path:hover': {
                    filter: `brightness(0.95)`,
                    transition: 'all 0.3s ease'
                  }
                })
              }}
            >
              {series.length > 0 && <Chart options={chartOptions} series={series} type="bar" height={480} />}
            </Box>
          </Stack>
        </MainCard>
      )}
    </>
  );
}

TotalBarangMasukKeluar.propTypes = { isLoading: PropTypes.bool };
