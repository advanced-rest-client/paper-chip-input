/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   PaperChipInput.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {LitElement, html, css} from 'lit-element';

import {PaperChipInputMixin} from './paper-chip-input-mixin.js';

export {PaperChipInput};

declare namespace ApiElements {

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
   */
  class PaperChipInput extends
    PaperChipInputMixin(
    Object) {

    /**
     * True if the suggestions box is currently opened.
     * Prevents `enter` from accepting the value.
     */
    _suggestionsOpened: boolean|null|undefined;

    /**
     * `iron-input` from the paper input to position auto suggestions
     * properly to the input real position.
     */
    _positionTarget: object|null|undefined;

    /**
     * A name of the icon to render on the chip when `removable` property
     * is set.
     * By default it referes to Polymer's default icons library, to the
     * `clear` icon. You must include this library into your document.
     * You can also use whatever other icons library.
     */
    chipRemoveIcon: string|null|undefined;
    firstUpdated(): void;

    /**
     * Listens for Enter key click and accepts the chip value if it can
     * be accepted.
     */
    _enterHandler(): void;

    /**
     * Removes latest chip if there's no value in the text field.
     */
    _backspaceHandler(): void;

    /**
     * Handler for `chip-removed` event.
     */
    _chipRemovedHandler(e: CustomEvent|null): void;

    /**
     * Inserts chip from suggestion.
     */
    _suggestionSelected(e: CustomEvent|null): void;

    /**
     * Chips are focusable elements and they work really
     * bed with paper-input as an addon.
     * This cancels the event so paper-input won't become focused.
     */
    _chipFocused(e: ClickEvent|null): void;
    _inputBlur(): void;
    _inputValueChanged(e: any): void;
    _inputInvalidChanged(e: any): void;
    _suggestionsOpenedChanged(e: any): void;
    _renderChipsTemplate(): any;
    render(): any;
  }
}
