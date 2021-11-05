import {
  Chart as ChartJS,
  BarController,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

// Initialisation modularisée pour CHARTJS 3
ChartJS.register(
  BarController,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);

/**
 * Mock pour pas DDOS encore plus l'API
 */
// import dummyData from "./data.json";
// console.log(dummyData);

class Chart {
  constructor(selector = "#graph") {
    this.selector = selector;
    this.element = document.querySelector("#graph");
    this.loader = document.querySelector(".lds-ring");

    this.config = {
      type: "bar",
      data: {},
      options: {},
    };

    this.chart = {};
  }

  fetchAPI = async () => {
    /**
     * Récupération des données
     */
    try {
      const response = await fetch(
        "https://dummy.restapiexample.com/api/v1/employees"
      );

      /**
       * parsing des données
       */
      const dummyData = await response.json();

      /**
       * Formatage des nom d'employés
       */
      const labels = dummyData.data.map(({ employee_name }) => {
        return employee_name;
      });

      /**
       * Formatage des salaires d'employés
       */
      const employeeData = dummyData.data.map(({ employee_salary }) => {
        return employee_salary;
      });

      /**
       * Mise à jour de la propriété pour injection dans le chart
       */
      this.config.data = { labels, datasets: [{ data: employeeData }] };
      this.initChart();

      /**
       * Suppression du span d'erreur en cas de re-fetch
       */
      if (this.span) {
        this.element.removeChild(this.span);
      }
    } catch (err) {
      /**
       * Suppression du loader en cas d'échec et ajour du message d'erreur
       */
      if (this.loader) {
        this.element.removeChild(this.loader);
        this.loader = null;

        this.span = document.createElement("span");
        this.span.textContent = "Fetch failed";
        this.element.appendChild(this.span);
      }

      /**
       * Restart du fetch (devient une fonction récurssive)
       */
      this.fetchAPI();

      throw err;
    }
  };

  initChart() {
    // Initialisation et sauvegarde du graph
    this.chart = new ChartJS(
      document.querySelector(this.selector + " canvas"),
      this.config
    );

    // Suppression du loader
    if (this.loader) {
      this.element.removeChild(this.loader);
      this.loader = null;
    }
  }
}

// nouvelle instance du graph
const chart = new Chart();
chart.fetchAPI();
