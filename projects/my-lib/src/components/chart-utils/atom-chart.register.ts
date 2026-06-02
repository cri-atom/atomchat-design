import {
  ArcElement, BarController, BarElement, CategoryScale, Chart,
  DoughnutController, Filler, Legend, LinearScale, LineController,
  LineElement, PointElement, Tooltip,
} from 'chart.js';

let registered = false;

export function ensureAtomChartsRegistered(): void {
  if (registered) return;
  Chart.register(
    CategoryScale, LinearScale, PointElement, LineElement, LineController,
    BarElement, BarController, ArcElement, DoughnutController,
    Filler, Legend, Tooltip,
  );
  registered = true;
}
