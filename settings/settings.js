var defaultOptions = {
  'contextMenuPlayVisible': true,
  'contextMenuEnqueueVisible': false,
};

function save_options() {
  var store = {};
  for (var id in defaultOptions) {
    var element = document.getElementById(id);
    var value = element.value;
    if (element.checked || value === 'on')
      value = element.checked;
    store[id] = value;
  }

  chrome.storage.sync.set(store, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
    console.log('Saved data: ', store);
  });
}

function load_options() {
  chrome.storage.sync.get(defaultOptions, function (values) {
    for (var id in defaultOptions) {
      var element = document.getElementById(id);
      if (typeof(values[id]) === 'boolean') {
        element.checked = values[id] === true;
      } else {
        element.value = values[id];
      }
      console.log('Loaded value "' + values[id] + '"for ' + id);
    }
  });
}

document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('save').addEventListener('click', save_options);
