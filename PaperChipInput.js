/*
Copyright 2018 Pawel Psztyc, The ARC team
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/

import { LitElement, html, css } from 'lit-element';
import '@polymer/paper-input/paper-input.js';
import '@advanced-rest-client/paper-chip/paper-chip.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/iron-icon/iron-icon.js';
import './paper-chip-autocomplete.js';
import { PaperChipInputMixin } from './paper-chip-input-mixin.js';
/**
 * `paper-chip-input`
 *
 * A material design input with material design chips.
 *
 * It renders chips on the left hand side of the input. It is added as an
 * add-on of the `paper-input` element.
 *
 * It allows to provide list of suggestions that are rendered is user input
 * allows to render suggestions.
 *
 * ## Example
 *
 * ```html
 * <paper-chip-input
 *  label="List your favourite fruits"
 *  required
 *  auto-validate
 *  name="fruits"
 *  allowed='["apple","Orange","BANANA"]'
 *  source='["Apple", "Apricot", 'Banana',"Orange"]'
 *  pattern="[a-zA-Z]+"
 *  error-message="This is not a fruit name!"></paper-chip-input>
 * ```
 *
 * ## Styling
 *
 * `<paper-chip-input>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 *
 * Use `paper-input` and `paper-chip` styles to style the element.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin PaperChipInputMixin
 */
export class PaperChipInput extends PaperChipInputMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: block;
      position: relative;

      --paper-input-container-input: {
        min-width: 170px;
      };
    }

    .chips {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }`;
  }


  static get properties() {
    return {
      /**
       * True if the suggestions box is currently opened.
       * Prevents `enter` from accepting the value.
       */
      _suggestionsOpened: { type: Boolean },
      /**
       * `iron-input` from the paper input to position auto suggestions
       * properly to the input real position.
       */
      _positionTarget: { type: Object },
      /**
       * A name of the icon to render on the chip when `removable` property
       * is set.
       * By default it referes to Polymer's default icons library, to the
       * `clear` icon. You must include this library into your document.
       * You can also use whatever other icons library.
       */
      chipRemoveIcon: { type: String }
    };
  }

  constructor() {
    super();
    this._inputValueChanged = this._inputValueChanged.bind(this);
    this._inputInvalidChanged = this._inputInvalidChanged.bind(this);
    this._inputBlur = this._inputBlur.bind(this);
    this._chipRemovedHandler = this._chipRemovedHandler.bind(this);
    this._chipFocused = this._chipFocused.bind(this);
    this._suggestionsOpenedChanged = this._suggestionsOpenedChanged.bind(this);
    this._suggestionSelected = this._suggestionSelected.bind(this);
    this._enterHandler = this._enterHandler.bind(this);
    this._backspaceHandler = this._backspaceHandler.bind(this);
  }

  firstUpdated() {
    super.firstUpdated();
    this._inputElement = this.shadowRoot.querySelector('.input-input');
    if (!this._inputElement.hasAttribute('tabindex')) {
      this._inputElement.setAttribute('tabindex', 0);
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'textbox');
    }
    this._positionTarget = this._inputElement.inputElement;
  }
  /**
   * Listens for Enter key click and accepts the chip value if it can
   * be accepted.
   */
  _enterHandler() {
    if (this._suggestionsOpened || !this.shadowRoot.querySelector('paper-input').validate()) {
      return;
    }
    const value = this._inputValue;
    if (!value) {
      return;
    }
    const lowerValue = value.toLowerCase();
    const source = this._findSource(this.source, lowerValue);
    const id = source && source.id;
    if (!this._isAllowed(value, id)) {
      return;
    }
    const icon = source && source.icon;
    this.addChip(value, true, icon, id);
    this._inputValue = '';
  }
  /**
   * Removes latest chip if there's no value in the text field.
   */
  _backspaceHandler() {
    const chips = this.chips;
    if (this._inputValue || !chips || !chips.length) {
      return;
    }
    let removeIndex = -1;
    for (let i = chips.length - 1; i >= 0; i--) {
      if (chips[i].removable) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex === -1) {
      return;
    }
    const chip = chips[removeIndex];
    this._removeChip(removeIndex);
    setTimeout(() => {
      this._inputValue = chip.label;
    });
  }
  /**
   * Handler for `chip-removed` event.
   * @param {CustomEvent} e
   */
  _chipRemovedHandler(e) {
    const index = Number(e.target.dataset.index);
    if (index !== index) {
      return;
    }
    this._removeChip(index);
  }
  /**
   * Inserts chip from suggestion.
   * @param {CustomEvent} e
   */
  _suggestionSelected(e) {
    const item = e.detail.value;
    if (!this._isAllowed(item.value, item.id)) {
      return;
    }
    this.addChip(item.value, true, item.icon, item.id);
    this._inputValue = '';
    setTimeout(() => {
      this._inputElement.inputElement.focus();
    });
  }
  /**
   * Chips are focusable elements and they work really
   * bed with paper-input as an addon.
   * This cancels the event so paper-input won't become focused.
   *
   * @param {ClickEvent} e
   */
  _chipFocused(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    this._inputElement.blur();
  }

  _inputBlur() {
    if (this._inputValue) {
      this._enterHandler();
    }
    // Chip looses it's focus right after getting it as input stills the focus.
    // const chips = this.shadowRoot.querySelectorAll('paper-chip');
    // for (let i = 0, len = chips.length; i < len; i++) {
    //   if (chips[i].focused) {
    //     chips[i]._focusBlurHandler({});
    //   }
    // }
  }

  _inputValueChanged(e) {
    this._inputValue = e.detail.value;
  }

  _inputInvalidChanged(e) {
    this.invalid = e.detail.value;
  }

  _suggestionsOpenedChanged(e) {
    this._suggestionsOpened = e.detail.value;
  }

  _renderChipsTemplate() {
    const chips = this.chips;
    if (!chips || !chips.length) {
      return;
    }
    const icon = this.chipRemoveIcon || 'clear';
    return chips.map((item, index) => html`
    <paper-chip
      .removable="${this._computeChipRemovable(item)}"
      @chip-removed="${this._chipRemovedHandler}"
      @focus="${this._chipFocused}"
      tabindex="-1"
      .removeIcon="${icon}"
      data-index="${index}">
      ${item.icon ? html `<iron-icon .icon="${item.icon}" slot="icon"></iron-icon>` : ''}
      ${item.label}
    </paper-chip>
    `);
  }

  render() {
    return html`<paper-input
      class="input-input"
      .always-float-label="${this.alwaysFloatLabel}"
      .no-label-float="${!this.alwaysFloatLabel}"
      .auto-validate="${this.autoValidate}"
      .disabled="${this.disabled}"
      .readonly="${this.readonly}"
      .value="${this._inputValue}"
      @value-changed="${this._inputValueChanged}"
      .label="${this.label}"
      .allowed-pattern="${this.allowedPattern}"
      .pattern="${this.pattern}"
      .char-counter="${this.charCounter}"
      .invalid="${this.invalid}"
      @invalid-changed="${this._inputInvalidChanged}"
      .error-message="${this.errorMessage}"
      .validator="${this.validator}"
      .autofocus="${this.autofocus}"
      .inputmode="${this.inputmode}"
      .minlength="${this.minlength}"
      .maxlength="${this.maxlength}"
      .name="${this.name}"
      .placeholder="${this.placeholder}"
      .autocapitalize="${this.autocapitalize}"
      .autocorrect="${this.autocorrect}"
      .autosave="${this.autosave}"
      @blur="${this._inputBlur}">
      <div class="chips" slot="prefix">
        ${this._renderChipsTemplate()}
      </div>
    </paper-input>
    <paper-chip-autocomplete
      .source="${this.source}"
      .value="${this._inputValue}"
      .positionTarget="${this._positionTarget}"
      .inputTarget="${this._inputElement}"
      dynamic-align=""
      vertical-align="top"
      vertical-offset="36"
      horizontal-align="left"
      @selected="${this._suggestionSelected}"
      .opened="${this._suggestionsOpened}"
      @opened-changed="${this._suggestionsOpenedChanged}"></paper-chip-autocomplete>
    <iron-a11y-keys
      .target="${this._inputElement}"
      keys="enter"
      @keys-pressed="${this._enterHandler}"></iron-a11y-keys>
    <iron-a11y-keys
      .target="${this._inputElement}"
      keys="backspace"
      @keys-pressed="${this._backspaceHandler}"></iron-a11y-keys>`;
  }
}
