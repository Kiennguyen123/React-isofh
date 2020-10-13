import { combineReducers } from 'redux'
import auth from './auth'
import users from './users';
import mdEnvironmentalTests from "./md-environmental-tests";
import infectionTypes from './infection-types'
import specimenTypes from "./specimen-types";
import infectiousDiseases from "./infectious-diseases";
import airPollutionIncidents from "./air-pollution-incidents"
import departments from "./departments";	
import environmentalTests from "./environmental-tests"
import sanitationProcesses from "./sanitation-processes";
import sanitationProcessTemplates from "./sanitation-process-templates";
import infectionPatients from './infection-patients';
import hospitalInfections from './hospital-infections';
import patientHistories from './patient-histories';
import dmDungcu from './dm-dung-cu';
import medicalInstruments from './medical-instruments';
import dmMauDungCu from './dm-mau-dung-cu';
import quanLyDoVai from './quan-ly-do-vai';
import quanLyDungCu from './quan-ly-dung-cu';
import authorization from './authorization'
import categoryIncidents from './category-incidents'
export default combineReducers({
	auth,
	users,
	mdEnvironmentalTests,
	infectiousDiseases,
	specimenTypes,
	infectionTypes,
	airPollutionIncidents,
	departments,
	sanitationProcesses,
	sanitationProcessTemplates,
	environmentalTests,
	infectionPatients,
	hospitalInfections,
	patientHistories,
	dmDungcu,
	medicalInstruments,
  quanLyDoVai,
	dmMauDungCu,
	quanLyDungCu,
	authorization,
	categoryIncidents
})