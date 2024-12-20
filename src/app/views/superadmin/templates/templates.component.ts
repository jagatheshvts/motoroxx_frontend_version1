import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreService } from 'src/app/shared/services/local-store.service';



@Component({
  selector: 'app-templates',
  // standalone: true,
  // imports: [],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements OnInit {
  popup: any;
  items = [];
  selectedTemplate = "";
  showTemplate = false;
  selectedValue = ''
  spareDesc: any = '';
  partCode: any = '';
  // rate: any = ''
  inputRows: any = [];
  templates: any;
  // types: any;
  // gettemplate: any;
  selectedTemplateValue: any;
  newTemplate: string = "";
  constructor(private popupmodal: NgbModal, private localservice: LocalStoreService) { }
  ngOnInit() {
    this.toggletemplate();
    this.gettemplatedata();
  }
  onSelectionChange(value) {
    console.log('Selected Value:', value);
  }
  toggletemplate() {
    this.inputRows.push({ spare: "", partcode: " ", description: " ", qty: " ", rate: " ", type: ""  })
  }
  openNewTemplateModal(addTemplate) {
    this.popup = this.popupmodal.open(addTemplate, {
      size: "md",
      centered: true
    })
  }
  closebtn() {
    this.popupmodal.dismissAll()
  }
  addRows() {
    this.inputRows.push({ spare: "", partcode: " ", description: " ", qty: " ", rate: " ", type: "" })
  }
  removerow(i) {
    this.inputRows.splice(i, 1)
  }
  gettemplatedata() {
    this.localservice.gettemplate().subscribe(data => {
      this.templates = [];
      if (data && data.templates) {
        data.templates.forEach(item => {
          this.templates.push(Object.keys(item)[0]);
        });
      }
      console.log("Templates:", this.templates);
    });
  }
  spareLaborSelect(event: Event, index: number) { 
    const selectedType = (event.target as HTMLSelectElement).value;
    if (selectedType === "spare" || selectedType === "labor") {
      console.log("The selected value is >>>>", selectedType);
      this.inputRows[index].type = selectedType; 
    } else {
      console.log("Please select a valid option");
    }
  }
  
  onTemplateSelect(event: Event, addTemplateModal: any) {
    const selectedOption = (event.target as HTMLSelectElement).value;

    if (selectedOption === 'addNew') {
      this.openNewTemplateModal(addTemplateModal); // Open modal for new template
    } else {
      this.selectedValue = selectedOption; // Save selected template
      console.log("Selected template:", this.selectedValue);
    }
  }


  save() {
    console.log("Input Rows before saving:", this.inputRows);
    const data = this.inputRows.map((row) => ({
      spare: row.spare,
      partcode: row.partcode,
      description: row.description,
      qty: row.qty,
      rate: row.rate,
      type: row.type
    }))
    const spareData = {
      data,
      templatesname: this.selectedValue,
    };

    this.localservice.savetemplate(spareData).subscribe(
      (data) => {
        console.log("Spare objects added to template:", data);
        this.inputRows = [];
      });
  }

  saveTemplateName() {
    if (this.newTemplate && this.newTemplate.trim() !== "") {
      const newTemplateObj = {
        templatesname: this.newTemplate.trim(),
        data: [{}]
      };

      console.log("New template being saved:", newTemplateObj);

      this.localservice.savetemplate(newTemplateObj).subscribe(data => {
        console.log("Template saved successfully:", data);
        this.templates.push(this.newTemplate.trim()); 
        this.newTemplate = ""; 
        this.selectedValue = ""; 
        this.closebtn()
      });
    } else {
      console.error("Template name cannot be empty!");
    }
  }

}
