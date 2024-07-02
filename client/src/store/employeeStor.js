import { makeAutoObservable } from 'mobx';

export default class EmployeeStore {
    _jobTitles = [];
    _awards = [];
    _subdivisions = [];
    _employees = [];
    _types = [
        { id: 1, title: "Сотрудники", navigate: 'info-page' },
        { id: 2, title: "Таблица", navigate: 'table' },
        { id: 3, title: "Награды", navigate: 'awards' }
    ];
    _selectedType = this._types[0] || {}; // Значение по умолчанию
    _selectedJT = null; // Выбранная должность
    _selectedAward = null; // Выбранная награда
    _selectedSub = null; // Выбранное подразделение

    constructor() {
        makeAutoObservable(this);
    }

    setJobTitles(jobTitles) {
        this._jobTitles = jobTitles;
    }

    setAwards(awards) {
        this._awards = awards;
    }

    setSubdivisions(subdivisions) {
        this._subdivisions = subdivisions;
    }

    setEmployees(employees) {
        this._employees = employees;
    }

    setTypes(types) {
        this._types = types;
    }

    setSelectedType(type) {
        this._selectedType = type;
    }

    setSelectedJT(jt) {
        this._selectedJT = jt;
    }

    setSelectedAward(award) {
        this._selectedAward = award;
    }

    setSelectedSub(sub) {
        this._selectedSub = sub;
    }

    get jobTitles() {
        return this._jobTitles;
    }

    get awards() {
        return this._awards;
    }

    get subdivisions() {
        return this._subdivisions;
    }

    get employees() {
        return this._employees;
    }

    get types() {
        return this._types;
    }

    get selectedType() {
        return this._selectedType;
    }

    get selectedJT() {
        return this._selectedJT;
    }

    get selectedAward() {
        return this._selectedAward;
    }

    get selectedSub() {
        return this._selectedSub;
    }
}
