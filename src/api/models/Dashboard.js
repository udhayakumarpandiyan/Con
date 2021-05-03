import Base from '../Base';

class Dashboard extends Base {
  constructor(http) {
    super(http);
    this.baseUrl = '/api/v2/dashboard/';
  }

  readJobGraph(params) {
    return this.http.get(`${this.baseUrl}graphs/jobs/`, {
      params,
    });
  }
  readJobTemplates(){
    return this.http.get(`/api/v2/job_templates/`);
  }

  readJobs(template_id){
    return this.http.get(`/api/v2/job_templates/${template_id}/jobs/`);
  }
}

export default Dashboard;
