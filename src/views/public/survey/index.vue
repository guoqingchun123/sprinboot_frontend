<template>
  <survey-list v-if="showSurvey" @on-start-survey-items="startSurveyItems" />
  <survey-item-list v-else :surveyId="surveyId" :title="title" @on-survey-list-return="startSurveys"/>
</template>

<script>
  
  import surveyList from './list.vue'
  import surveyItemList from './itemList.vue'
  
  export default {
    name: 'IndexSurvey',
    components: {
      surveyList,
      surveyItemList
    },
    data() {
      return {
        showSurvey: true,
        surveyId: null,
        title: null
      }
    },
    created() {
    },
    methods: {
      startSurveyItems(surveyId, title) {
        this.surveyId = surveyId;
        this.title = title + "问题一览";
        this.showSurvey = false;
      },
      startSurveys() {
        this.showSurvey = true;
        this.surveyId = null;
        this.title = null;
      }
    }
  }
</script>
