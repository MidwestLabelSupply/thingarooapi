const ProcessHistory = require('./models/templates/processHistory');

const TemplateToModelMap = {
  'PROCESS_HISTORY': new ProcessHistory()
};

module.exports = {
  TemplateToModelMap
}
