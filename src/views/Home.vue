<template>
  <div class="home">
    <main>
      <div class="text-panel">
        <h1>Color of <span class="accent-color">COVID</span>: Chicago</h1>

        <div class="text-panel__main">
          <p>
            This is a map of COVID incidents in Chicago colored by race.
          </p>

          <div class="controls">
            <div class="event-type-container">
              <p>Choose from:</p>

              <div class="event-type-button-group btn-group" role="group" aria-label="Basic example">
                <button type="button"
                        :class="`btn btn-lg btn-dark ${selectedEventType === 'cases' ? 'active' : ''}`"
                        @click="selectedEventType = 'cases'"
                >
                  Cases
                </button>
                <button type="button"
                        :class="`btn btn-lg btn-dark ${selectedEventType === 'deaths' ? 'active' : ''}`"
                        @click="selectedEventType = 'deaths'"
                >
                  Deaths
                </button>
                <button type="button"
                        :class="`btn btn-lg btn-dark ${selectedEventType === 'tests' ? 'active' : ''}`"
                        @click="selectedEventType = 'tests'"
                >
                  Tests
                </button>
              </div>
            </div>

            <div class="legend-container">
              <p>The colors used for each race are:</p>

              <table class="legend table table-dark">
                <tr>
                  <td>
                    <div class="legend-circle legend-circle--black" />
                  </td>
                  <td>Black</td>
                </tr>
                <tr>
                  <td><div class="legend-circle legend-circle--hispanic" /></td>
                  <td>Latinx/Hispanic</td>
                </tr>
                <tr>
                  <td><div class="legend-circle legend-circle--white" /></td>
                  <td>White</td>
                </tr>
                <tr>
                  <td><div class="legend-circle legend-circle--asian" /></td>
                  <td>Asian</td>
                </tr>
                <tr>
                  <td><div class="legend-circle legend-circle--other" /></td>
                  <td>Other</td>
                </tr>
              </table>
            </div>
          </div>

          <Questions :selected-event-type="selectedEventType"
                     class="explainer--not-mobile"
          />
        </div>
      </div>

      <div id="map-container" />

      <div class="more-info">
        More Info
        <font-awesome-icon icon="arrow-down" />
      </div>

      <!-- TODO this is a big kludge to rearrange components for mobile. make better. -->
      <Questions :selected-event-type="selectedEventType"
                 class="explainer--mobile"
      />
    </main>
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import Questions from '@/components/Questions.vue';

mapboxgl.accessToken = 'pk.eyJ1IjoicGFuYmFsYW5nYSIsImEiOiJja2JkeXdiNmowOGgwMnJtdGpqYzMyNHFpIn0.Qlq3RivgpxUJvZEwRWQVqw';

export default {
  name: 'Home',
  components: {
    Questions,
  },
  data() {
    return {
      selectedEventType: 'cases',
    };
  },
  mounted() {
    let zoom = 10;

    // on mobile, zoom out more since the map viewport is smaller
    if (window.innerWidth < 1024) {
      zoom = 9;
    }

    const map = new mapboxgl.Map({
      container: 'map-container',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-87.6667024, 41.8399768],
      zoom,
      minZoom: 8.5,
      maxZoom: 12,
    });
    this.map = map;

    map.on('load', this.mapDidLoad);
  },
  watch: {
    selectedEventType(nextEventType, prevEventType) {
      this.map.setLayoutProperty(prevEventType, 'visibility', 'none');
      this.map.setLayoutProperty(nextEventType, 'visibility', 'visible');
    },
  },

  methods: {
    mapDidLoad() {
      const { map } = this;

      // add nav
      map.addControl(new mapboxgl.NavigationControl());

      // remove map labels
      map.style.stylesheet.layers.forEach((layer) => {
        if (layer.type === 'symbol') {
          map.removeLayer(layer.id);
        }
      });

      const PAINT_OPTIONS = {
        'circle-radius': [
          'interpolate', ['linear'], ['zoom'],
          8.5, 0.85,
          10, 1.25,
          12, 1.5,
        ],
        'circle-opacity': 0.9,
        'circle-color': [
          'match',
          ['get', 'race'],
          ['asian'],
          'hsl(0, 100%, 60%)',
          ['hispanic'],
          'hsl(38, 100%, 60%)',
          ['other'],
          'hsl(53, 100%, 60%)',
          ['white'],
          'hsl(196, 100%, 60%)',
          ['black'],
          'hsl(132, 100%, 60%)',
          // there shouldn't be any of these - look for bright yellow
          'hsl(62, 100%, 100%)',
        ],
      };

      // TODO refactor this into a forEach
      // add cases
      map.addSource('cases', {
        type: 'vector',
        tiles: [
          'https://d1o79a3grltvuu.cloudfront.net/cases/{z}/{x}/{y}.pbf',
        ],
      });
      map.addLayer({
        id: 'cases',
        type: 'circle',
        source: 'cases',
        'source-layer': 'cases',
        layout: {},
        paint: PAINT_OPTIONS,
      });

      // add deaths
      map.addSource('deaths', {
        type: 'vector',
        tiles: [
          'https://d1o79a3grltvuu.cloudfront.net/deaths/{z}/{x}/{y}.pbf',
        ],
      });
      map.addLayer({
        id: 'deaths',
        type: 'circle',
        source: 'deaths',
        'source-layer': 'deaths',
        layout: {
          visibility: 'none',
        },
        paint: Object.assign(
          PAINT_OPTIONS,
          {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              8.5, 1.5,
              10, 1.85,
              12, 2.25,
            ],
          },
        ),
      });

      // add tests
      map.addSource('tests', {
        type: 'vector',
        tiles: [
          'https://d1o79a3grltvuu.cloudfront.net/tests/{z}/{x}/{y}.pbf',
        ],
      });
      map.addLayer({
        id: 'tests',
        type: 'circle',
        source: 'tests',
        'source-layer': 'tests',
        layout: {
          visibility: 'none',
        },
        paint: Object.assign(
          PAINT_OPTIONS,
          {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              8.5, 0.55,
              10, 1,
              12, 1.5,
            ],
          },
        ),
      });

      // map.on('zoom', () => {
      //   console.log(map.getZoom());
      // });
    },
  },
};
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  background: #000;
  color: #eee;
}

/* https://stackoverflow.com/a/44145771/676001 */
@media
  not screen and (min-device-pixel-ratio: 2),
  not screen and (min-resolution: 192dpi) {
    span.emoji {
      margin-right: 5px;
    }
  }

.accent-color,
.text-panel a:link,
.text-panel a:visited {
  color: #ff0079;
}

.text-panel {
  display: flex;
  flex-direction: column;
  flex-basis: 500px;
  padding: 1rem;
}

.controls {
  display: flex;
  flex-direction: column;
}

.controls > * {
  margin-bottom: 1rem;
}

.event-type-container {
  order: 2;
}

.legend-container {
  order: 1;
}

.legend-container p {
  display: none;
}

h1 {
  border-bottom: 1px solid #aaa;
  padding-bottom: 2rem;
  margin-bottom: 1.65rem;
}

p {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

/* override some bootstrap colors */
.btn-dark,
.table-dark {
  background-color: rgb(50, 50, 50);
}
.btn-dark:not(:disabled):not(.disabled).active,
.btn-dark:not(:disabled):not(.disabled):active,
.show > .btn-dark.dropdown-toggle {
  background-color: #ff0079;
}

.legend {
  width: 100px;
}

.legend-circle {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}

.legend-circle--asian {
  background-color: hsl(0, 100%, 60%);
}

.legend-circle--hispanic {
  background-color: hsl(38, 100%, 60%);
}

.legend-circle--other {
  background-color: hsl(53, 100%, 60%);
}

.legend-circle--white {
  background-color: hsl(196, 100%, 60%);
}

.legend-circle--black {
  background-color: hsl(132, 100%, 60%);
}

#map-container {
  flex-grow: 1;
  /* mobile */
  height: 400px;
}

.more-info {
  text-align: center;
  margin-top: 0.75rem;
  color: #777;
  text-transform: uppercase;
  letter-spacing: 0.3rem;
}

.explainer--not-mobile {
  display: none;
}

.explainer--mobile {
  display: block;
}

footer {
  border-top: 1px solid #aaa;
  padding-top: 0.5rem;
  margin-top: 2rem;
}

/* desktop only */
@media only screen and (min-width: 1024px) {
  main {
    display: flex;
    flex-direction: row;
    height: 100vh;
  }

  .text-panel {
    overflow-y: auto;
    padding: 1.5rem;
    margin-bottom: 0;
  }

  .controls > * {
    margin-bottom: 1.25rem;
  }

  .event-type-container {
    order: 1;
  }

  .legend-container {
    order: 2;
  }

  .legend-container p {
    display: block;
  }

  #map-container {
    height: 100%;
    flex-grow: 1;
  }

  .more-info {
    display: none;
  }

  .explainer--not-mobile {
    display: block;
  }

  .explainer--mobile {
    display: none;
  }
}
</style>
