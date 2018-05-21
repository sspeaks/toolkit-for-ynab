import { Feature } from 'toolkit/extension/features/feature';
import { getCurrentRouteName } from 'toolkit/extension/utils/ynab';
import { controllerLookup } from 'toolkit/extension/utils/ember';

export class ToggleTransactionFilters extends Feature {
  injectCSS() {
    return require('./index.css');
  }

  shouldInvoke() {
    return getCurrentRouteName().indexOf('account') > -1;
  }

  onRouteChanged() {
    if (!this.shouldInvoke()) return;

    this.invoke();
  }

  invoke() {
    // create or update buttons
    this.initToggleButtons();
  }

  observe(changedNodes) {
    if (!this.shouldInvoke()) return;

    // activate button styles if filters potentially change
    // activate if switch to individual account, or all accounts views
    if (
      changedNodes.has('modal-overlay ynab-u modal-generic modal-account-filters active closing') ||
      changedNodes.has('ynab-grid-body')) {
      this.initToggleButtons();
    }
  }

  toggleReconciled() {
    let container = controllerLookup('accounts');
    let settingReconciled = !container.filters.get('reconciled');
    container.filters.get('propertiesToSet').setProperties({ reconciled: settingReconciled });
    container.filters.applyFilters();

    if (settingReconciled) {
      $('#toolkit-toggleReconciled').removeClass('toolkit-button-toggle-hidden').addClass('toolkit-button-toggle-visible');
    } else {
      $('#toolkit-toggleReconciled').addClass('toolkit-button-toggle-hidden').removeClass('toolkit-button-toggle-visible');
    }
  }

  toggleScheduled() {
    let container = controllerLookup('accounts');
    let settingScheduled = !container.filters.get('scheduled');
    container.filters.get('propertiesToSet').setProperties({ scheduled: settingScheduled });
    container.filters.applyFilters();

    if (settingScheduled) {
      $('#toolkit-toggleScheduled').removeClass('toolkit-button-toggle-hidden').addClass('toolkit-button-toggle-visible');
    } else {
      $('#toolkit-toggleScheduled').addClass('toolkit-button-toggle-hidden').removeClass('toolkit-button-toggle-visible');
    }
  }

  updateToggleButtons(settingReconciled, settingScheduled) {
    // set button classes
    if (settingReconciled) {
      $('#toolkit-toggleReconciled').removeClass('toolkit-button-toggle-hidden').addClass('toolkit-button-toggle-visible');
    } else {
      $('#toolkit-toggleReconciled').addClass('toolkit-button-toggle-hidden').removeClass('toolkit-button-toggle-visible');
    }

    if (settingScheduled) {
      $('#toolkit-toggleScheduled').removeClass('toolkit-button-toggle-hidden').addClass('toolkit-button-toggle-visible');
    } else {
      $('#toolkit-toggleScheduled').addClass('toolkit-button-toggle-hidden').removeClass('toolkit-button-toggle-visible');
    }
  }

  initToggleButtons() {
    // get internal filters
    let container = controllerLookup('accounts');
    let settingReconciled = container.filters.get('reconciled');
    let settingScheduled = container.filters.get('scheduled');

    // insert or edit buttons
    if (!$('#toolkit-toggleReconciled').length) {
      // create buttons if they don't already exist
      $('.accounts-toolbar .accounts-toolbar-right')
        .append($('<button>', { id: 'toolkit-toggleReconciled', class: 'button', title: 'Toggle Reconciled Transactions' })
          .click(() => { this.toggleReconciled(); })
          .append($('<i>', { class: 'flaticon solid lock-1 is-reconciled' })
          // show both text and icons or just the icon
            .append(this.settings.enabled === '2' ? ' Reconciled' : '')));

      $('.accounts-toolbar .accounts-toolbar-right')
        .append($('<button>', { id: 'toolkit-toggleScheduled', class: 'button', title: 'Toggle Scheduled Transactions' })
          .click(() => { this.toggleScheduled(); })
          .append($('<i>', { class: 'flaticon solid clock-1 is-reconciled' })
          // show both text and icons or just the icon
            .append(this.settings.enabled === '2' ? ' Scheduled' : '')));

      this.updateToggleButtons(settingReconciled, settingScheduled);
    } else {
      // if buttons exist, double check visibility classes
      this.updateToggleButtons(settingReconciled, settingScheduled);
    }
  }
}