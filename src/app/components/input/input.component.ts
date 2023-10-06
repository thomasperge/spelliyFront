import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouteActiveService } from 'src/app/services/route-active.service';
import { TextareaInputService } from 'src/app/services/textarea-input.service';
import { UsagesService } from 'src/app/services/usages.service';
import { TranslateService } from 'src/app/services/translate.service';
import { TextareaOutputService } from 'src/app/services/textarea-output.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {
  textForm = this.formBuilder.group({
    text: '',
  });

  letterCounter = '0/1000';
  letterCount: number = 0;
  currentUsages: number = 0;
  outPutData: String = "";
  responseGpt: any;
  outputContent: any;

  constructor(private activedRouteService: RouteActiveService, private formBuilder: FormBuilder, private textService: TextareaInputService, private activatedRoute: ActivatedRoute, private usagesService: UsagesService, private translateService: TranslateService, private textareaOutputService: TextareaOutputService) { }
  
  isTranslateRouteActive(): boolean {
    this.initText()
    this.updateLetterCounter();
    return this.activedRouteService.isActiveRoute('/translator');
  }

  isReformulateRouteActive(): boolean {
    this.initText()
    this.updateLetterCounter();
    return this.activedRouteService.isActiveRoute('/reformulate');
  }

  isSpellCheckerRouteActive(): boolean {
    this.initText()
    this.updateLetterCounter();
    return this.activedRouteService.isActiveRoute('/spell-checker');
  }

  updateLetterCounter() {
    let textValue = this.textForm.value.text;
    const currentLength = textValue ? textValue.length : 0;
    // Condition counter 1000 letters
    if (currentLength >= 1000 && textValue != null) {
      textValue = textValue.substring(0, 1000);
      this.textForm.patchValue({ text: textValue });
    }

    this.letterCount = currentLength;
    this.letterCounter = `${currentLength}/1000`;
  }

  ngOnInit(): void {
    const initialText = this.textService.getText();
    
    if (initialText) {
      this.textForm.patchValue({ text: initialText });
    }
  }

  initText() {
    const textValue = this.textForm.value.text;
  
    if (textValue !== null && textValue !== undefined) {
      this.textService.setText(textValue);
    }
  }

  onSubmitInput(query: String) {
    let textValue = this.textForm.value.text;
    const currentLength = textValue ? textValue.length : 0;

    if (this.activedRouteService.isActiveRoute('/translator')) {
      // Translate
      this.activatedRoute.queryParamMap.subscribe(params => {
        if (params.has('lang') && currentLength >= 1) {
          this.usagesService.addUsages()
          // Subscribe to Observer to get response
          this.translateService.getTranslateOutput(query).subscribe(response => {
            this.responseGpt = response
            this.outputContent = this.responseGpt.choices[0].message.content;
            console.log(this.outputContent);
            
            // this.sendOutputData()
            // this.outputComponent.updateOutputTextArea()
          });
        }
      })
    } else if (this.activedRouteService.isActiveRoute('/reformulate')) {
      // Reformulate
      this.activatedRoute.queryParamMap.subscribe(params => {
        if (params.has('lvl') && params.has('length') && currentLength >= 1) {
          this.usagesService.addUsages()
        }
      })
    } else if (this.activedRouteService.isActiveRoute('/spell-checker')) {
      // Spell Checker
      if (currentLength >= 1) {
        this.usagesService.addUsages()
      }
    }

    this.initText()
  }

  sendOutputData() {
    this.textareaOutputService.setOutPutData(this.outputContent)
  }
}
