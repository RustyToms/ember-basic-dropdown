import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import $ from 'jquery';
import run from 'ember-runloop';
// import { fireKeydown } from '../../../helpers/ember-basic-dropdown';
// import set from 'ember-metal/set';

moduleForComponent('ember-basic-dropdown', 'Integration | Component | basic-dropdown/content', {
  integration: true
});

test('If the dropdown is open renders the given block in a div with class `ember-basic-dropdown-content`', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.text().trim(), 'Lorem ipsum', 'It contains the given block');
  assert.equal($content.parent()[0].id, 'ember-testing', 'It is rendered in the #ember-testing div');
});

test('If the dropdown is closed, nothing is rendered', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: false };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.length, 0, 'Nothing is rendered');
});

test('If it receives `renderInPlace=true`, it is rendered right here instead of elsewhere', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown renderInPlace=true}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = this.$('.ember-basic-dropdown-content');
  assert.equal($content.length, 1, 'It is rendered in the spot');
  assert.notEqual($content.parent()[0].id, 'ember-testing', 'It isn\'t rendered in the #ember-testing div');
});

test('If it receives `to="foo123"`, it is rendered in the element with that ID', function(assert) {
  assert.expect(2);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true };
  this.render(hbs`
    <div id="foo123"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown to="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = this.$('#foo123 .ember-basic-dropdown-content');
  assert.equal($content.length, 1, 'It is rendered');
  assert.equal($content.parent()[0].id, 'foo123', 'It is rendered in the element with the given ID');
});

test('If it receives `dropdownId="foo123"`, the rendered content will have that ID', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown elementId="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content');
  assert.equal($content.attr('id'), 'foo123', 'contains the expected ID');
});

test('If it receives `class="foo123"`, the rendered content will have that class along with the default one', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = { isOpen: true };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown class="foo123"}}Lorem ipsum{{/basic-dropdown/content}}
  `);
  let $content = $('.ember-basic-dropdown-content.foo123');
  assert.equal($content.length, 1, 'The dropdown contains that class');
});

test('Clicking anywhere in the app outside the component will invoke the close action on the dropdown', function(assert) {
  assert.expect(1);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() { assert.ok(true, 'The close action gets called'); }
    }
  };
  this.render(hbs`
    <div id="other-div"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}Lorem ipsum{{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    this.$('#other-div')[0].dispatchEvent(event);
  })
});

test('Clicking anywhere inside the dropdown content doesn\'t invoke the close action', function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() { assert.ok(false, 'The close action should not be called'); }
    }
  };
  this.render(hbs`
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown}}<div id="inside-div">Lorem ipsum</div>{{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    $('#inside-div')[0].dispatchEvent(event);
  })
});

test('Clicking in the trigger doesn\'t invoke the close action' , function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown = {
    isOpen: true,
    actions: {
      close() { assert.ok(false, 'The close action should not be called'); }
    }
  };
  this.render(hbs`
    <div id="fake-trigger"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown triggerId="fake-trigger"}}Lorem ipsum{{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    $('#fake-trigger')[0].dispatchEvent(event);
  })
});

test('Clicking in inside the a dropdown content nested inside another dropdown content doesn\'t invoke the close action on neither of them if the second is rendered in place' , function(assert) {
  assert.expect(0);
  this.appRoot = document.querySelector('#ember-testing');
  this.dropdown1 = {
    isOpen: true,
    actions: {
      close() { assert.ok(false, 'The close action should not be called'); }
    }
  };
  this.dropdown2 = {
    isOpen: true,
    actions: {
      close() { assert.ok(false, 'The close action should not be called either'); }
    }
  };
  this.render(hbs`
    <div id="fake-trigger"></div>
    {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown1}}
      Lorem ipsum
      {{#basic-dropdown/content appRoot=appRoot dropdown=dropdown2 renderInPlace=true}}
        <div id="nested-content-div">dolor sit amet</div>
      {{/basic-dropdown/content}}
    {{/basic-dropdown/content}}
  `);

  run(() => {
    let event = new window.Event('mousedown', { bubbles: true, cancelable: true, view: window });
    $('#nested-content-div')[0].dispatchEvent(event);
  })
});