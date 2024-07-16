import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { RespondentService } from '../_services/respondent.service';
import { Respondent } from '../_models/respondent';
import { BranchService } from '../_services/branch.service'; // Импорт BranchService
import { Branch } from '../_models/branch'; // Импорт модели Branch

@Component({
  selector: 'app-respondent-list',
  templateUrl: './respondents-list.component.html',
  styleUrls: ['./respondents-list.component.css']
})
export class RespondentListComponent implements OnInit {
  respondents: Respondent[] = [];
  branches: Branch[] = []; // Новое поле для хранения списка филиалов
  selectedRespondent: Respondent = { // Измененная строка: указаны тип и инициализация объекта
    id: 0,
    name: '',
    registrationDate: new Date(),
    city: '',
    branchId: 0,
    role: ''
  };
  modalRef?: BsModalRef;

  constructor(private respondentService: RespondentService,
    private branchService: BranchService, // Добавлен BranchService в конструктор
    private modalService: BsModalService) {}

  ngOnInit() {
    this.loadRespondents();
    this.loadBranches(); // Загрузка списка филиалов при инициализации компонента
  }

  loadRespondents() {
    this.respondentService.getRespondents().subscribe(data => {
      this.respondents = data.sort((a, b) => a.id - b.id); // Сортируем респондентов по id
    });
  }

  loadBranches() { // Новый метод для загрузки списка филиалов
    this.branchService.getBranches().subscribe(data => {
      this.branches = data;
    });
  }

  openModal(template: TemplateRef<any>, respondent?: Respondent) { // Измененная строка: указание типа для respondent
    this.selectedRespondent = respondent ? { ...respondent } : { // Измененная строка: инициализация нового респондента
      id: 0,
      name: '',
      registrationDate: new Date(),
      city: '',
      branchId: 0,
      role: ''
    };
    this.modalRef = this.modalService.show(template);
  }

  saveRespondent() {
    if (this.selectedRespondent.id) {
      this.respondentService.updateRespondent(this.selectedRespondent.id, this.selectedRespondent).subscribe(() => {
        this.loadRespondents();
      });
    } else {
      console.log(this.selectedRespondent);
      this.respondentService.createRespondent(this.selectedRespondent).subscribe(() => {
        this.loadRespondents();
      });
    }
    this.modalRef?.hide();
  }

  deleteRespondent(id: number) {
    this.respondentService.deleteRespondent(id).subscribe(() => {
      this.loadRespondents();
    });
  }
}
