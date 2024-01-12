class Validator {
  constructor(config) {
    this.errors = {};
    this.elementsConfig = config;

    this.generateErrorsObject();
    this.inputListener();
  }

  generateErrorsObject() {
    for (let field in this.elementsConfig) {
      this.errors[field] = [];
    }
  }

  inputListener() {
    for (let field in this.elementsConfig) {
      let el = document.querySelector(`input[name="${field}"]`);
      el.addEventListener('input', (e) => this.validate(e));
    }
  }

  validate(e) {
    let elFields = this.elementsConfig;
    let field = e.target;
    let fieldName = field.getAttribute('name');
    let fieldValue = field.value;

    this.errors[fieldName] = [];

    if (elFields[fieldName].required) {
      if (fieldValue === '') {
        this.errors[fieldName].push('Polje je prazno');
      }
    }

    if (elFields[fieldName].email) {
      if (!this.validateEmail(fieldValue)) {
        this.errors[fieldName].push('Neispravna email adresa');
      }
    }

    if (fieldValue.length < elFields[fieldName].minlength) {
      this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} karaktera`);
    }

    if (fieldValue.length > elFields[fieldName].maxlength) {
      this.errors[fieldName].push(`Maksimalan broj karaktera je ${elFields[fieldName].maxlength}`);
    }

    if (elFields[fieldName].matching) {
      let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);
      if (fieldValue !== matchingEl.value) {
        this.errors[fieldName].push('Lozinke se ne poklapaju');
      }

      if (this.errors[fieldName].length === 0) {
        this.errors[fieldName] = [];
        this.errors[elFields[fieldName].matching] = [];
      }
    }

    this.populateErrors(this.errors);
  }

  validateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }

    return false;
  }

  populateErrors(errors) {
    let parentElement;
    let errorsElement;

    for (const elem of document.querySelectorAll('ul')) {
      elem.remove();
    }

    for (let key in errors) {
      parentElement = document.querySelector(`input[name="${key}"]`);
      errorsElement = parentElement.nextElementSibling;

      if (!errorsElement || errorsElement.tagName !== 'UL') {
        errorsElement = document.createElement('ul');
        parentElement.parentNode.insertBefore(errorsElement, parentElement.nextSibling);
      }

      errorsElement.innerHTML = '';

      errors[key].forEach(error => {
        let li = document.createElement('li');
        li.innerText = error;
        errorsElement.appendChild(li);
      });
    }
  }
}