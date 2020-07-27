<template>
  <div class="explainer">
      <section class="qa">
      <h2 class="qa__header"
          @click="setActiveQuestion('data')"
      >
        <div class="qa__question">
          What data is this?
        </div>

        <div class="qa__expander">
          <font-awesome-icon :icon="`chevron-${activeQuestion === 'data' ? 'up' : 'down'}`" />
        </div>
      </h2>

      <div class="qa__answer"
           v-if="activeQuestion === 'data'"
      >
        <p>
          This is a snapshot from the Illinois Department
          of Public Health <a href="https://www.dph.illinois.gov/covid19/covid19-statistics" target="_external">
          COVID-19 Statistics</a> portal from June 13, 2020. Around that time
          IDPH stopped releasing death breakdowns by ZIP code, which is why
          the data is a bit out of date—but it seems probable that the
          geographic patterns of COVID have held fairly steady since then.
        </p>
      </div>
    </section>

    <section class="qa">
      <h2 class="qa__header"
          @click="setActiveQuestion('locations')"
      >
        <div class="qa__question">
          Where is each dot located?
        </div>

        <div class="qa__expander">
          <font-awesome-icon :icon="`chevron-${activeQuestion === 'locations' ? 'up' : 'down'}`" />
        </div>
      </h2>

      <div class="qa__answer"
           v-if="activeQuestion === 'locations'"
      >
        <p>
          Each {{ selectedEventTypeSingular }} has been placed randomly in
          the ZIP code where it occurred. I used 2018 ACS
          demographic data at the block group level to try to infer a more
          accurate location, but points are only guaranteed to be in the right
          ZIP code.
        </p>
      </div>
    </section>

    <section class="qa">
      <h2 class="qa__header"
          @click="setActiveQuestion('making-of')"
      >
        <div class="qa__question">
          How was this made?
        </div>

        <div class="qa__expander">
          <font-awesome-icon :icon="`chevron-${activeQuestion === 'making-of' ? 'up' : 'down'}`" />
        </div>
      </h2>

      <div class="qa__answer"
        v-if="activeQuestion === 'making-of'"
      >
        <p>
          I wrote a Python script to assign each COVID {{ selectedEventTypeSingular}}
          to a census block group based on the probability that a person of that
          race would live there. It then generates a random point within the
          block group. Since block
          groups don't follow ZIP code boundaries exactly, I used QGIS to
          split block groups by ZIPs. This ensures that each point falls
          inside ZIP code it's assigned to.
        </p>
        <p>
          Feel free to check out the code over on <a href="https://github.com/rbrtmrtn/color-of-covid" target="_external">GitHub</a>.
          And big hat tip to the
          <a href="racialdotmap.demographics.coopercenter.org">Racial Dot Map</a>
          for cartographic inspiration.
        </p>
      </div>
    </section>

    <section class="qa">
      <h2 class="qa__header"
          @click="setActiveQuestion('author')"
      >
        <div class="qa__question">
          Who made this?
        </div>

        <div class="qa__expander">
          <font-awesome-icon :icon="`chevron-${activeQuestion === 'author' ? 'up' : 'down'}`" />
        </div>
      </h2>

      <div class="qa__answer"
        v-if="activeQuestion === 'author'"
      >
        <p>
          Hi, I'm Robert. I'm a freelance software engineer based in Chicago.
          I like all things cities and data. Feel free to connect with me on
          <a href="https://twitter.com/rbrt_mrtn" target="_external">Twitter</a> or
          <a href="https://linkedin.com/in/rbrtmrtn/" target="_external">LinkedIn</a>.
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: ['selectedEventType'],
  data() {
    return {
      activeQuestion: null,
    };
  },
  computed: {
    selectedEventTypeSingular() {
      return this.selectedEventType.replace(/s$/, '');
    },
  },
  methods: {
    setActiveQuestion(key) {
      console.log('did activate question', key);

      // if they're closing it
      // TODO this is super kludgy the active question should be handled more
      // abstractly, probably by index rather than arbitrary key
      if (key !== this.activeQuestion) {
        this.activeQuestion = key;
      } else {
        this.activeQuestion = null;
      }
    },
  },
};
</script>

<style>
/* TODO this is only necessary because of the duplication-for-mobile hack. figure
out a better way of placing the questions after the map on mobile long-term */
.explainer {
  border-top: 1px solid #aaa;
  padding-top: 1.5rem;
  padding-bottom: 2rem;
}

.explainer--mobile {
  background: #000;
  color: #fff;
  margin-top: 1.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.explainer--mobile a:link,
.explainer--mobile a:visited {
  color: #ff0079;
}

.qa {
  margin-bottom: 2rem;
}

.qa__header {
  font-size: 1.25rem;
  display: flex;
  justify-content: space-between;
}

.qa__header:hover {
  color: #ff0079;
}

.qa__answer {
  padding-top: 1rem;
}

.qa__answer p {
  font-size: 1rem;
}

.qa:last-of-type {
  /* padding-bottom: 2rem; */
}

@media only screen and (min-width: 1024px) {
  .explainer {
    padding-bottom: 0;
  }
}
</style>
