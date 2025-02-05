import { BenchmarkTestStep } from "./benchmark-runner.mjs";

const numberOfItemsToAdd = 100;
export const Suites = [];
const ENTER_KEY_CODE = 13;

let triggerEnter = function (element, type) {
    const event = document.createEvent('Events');
    event.initEvent(type, true, true);
    event.keyCode = ENTER_KEY_CODE;
    event.which = ENTER_KEY_CODE;
    event.key = 'ENTER';
    element.dispatchEvent(event);
}

Suites.push({
    name: 'VanillaJS-TodoMVC',
    url: 'todomvc/vanilla-examples/vanillajs/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('change'));
                triggerEnter(newTodo, 'keypress');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'Vanilla-ES2015-TodoMVC',
    url: 'todomvc/vanilla-examples/es2015/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then((element)  => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('change'));
                triggerEnter(newTodo, 'keypress');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'Vanilla-ES2015-Babel-Webpack-TodoMVC',
    url: 'todomvc/vanilla-examples/es2015-babel-webpack/dist/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('change'));
                triggerEnter(newTodo, 'keypress');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'React-TodoMVC',
    url: 'todomvc/architecture-examples/react/index.html',
    prepare(runner, contentWindow, contentDocument) {
        contentWindow.app.Utils.store = () => {};
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('input', {
                  bubbles: true,
                  cancelable: true
                }));
                triggerEnter(newTodo, 'keydown');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'React-Redux-TodoMVC',
    url: 'todomvc/architecture-examples/react-redux/dist/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                triggerEnter(newTodo, 'keydown');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'EmberJS-TodoMVC',
    url: 'todomvc/architecture-examples/emberjs/dist/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('#new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                triggerEnter(newTodo, 'keydown');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'EmberJS-Debug-TodoMVC',
    url: 'todomvc/architecture-examples/emberjs-debug/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('#new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                triggerEnter(newTodo, 'keydown');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'BackboneJS-TodoMVC',
    url: 'todomvc/architecture-examples/backbone/index.html',
    prepare(runner, contentWindow, contentDocument) {
        contentWindow.Backbone.sync = () => {};
        return runner.waitForElement('#appIsReady').then(element => {
            const newTodo = contentDocument.querySelector('.new-todo');
            newTodo.focus();
            return newTodo;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                triggerEnter(newTodo, 'keypress');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < numberOfItemsToAdd; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < numberOfItemsToAdd; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'AngularJS-TodoMVC',
    url: 'todomvc/architecture-examples/angularjs/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('#new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            const submitEvent = document.createEvent('Event');
            submitEvent.initEvent('submit', true, true);
            const inputEvent = document.createEvent('Event');
            inputEvent.initEvent('input', true, true);
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(inputEvent);
                newTodo.form.dispatchEvent(submitEvent);
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingAllItems', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++)
                contentDocument.querySelector('.destroy').click();
        }),
    ]
});

Suites.push({
    name: 'Angular2-TypeScript-TodoMVC',
    url: 'todomvc/architecture-examples/angular/dist/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('input', {
                  bubbles: true,
                  cancelable: true
                }));
                triggerEnter(newTodo, 'keyup');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'VueJS-TodoMVC',
    url: 'todomvc/architecture-examples/vuejs-cli/dist/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('input', {
                  bubbles: true,
                  cancelable: true
                }));
                triggerEnter(newTodo, 'keyup');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'jQuery-TodoMVC',
    url: 'todomvc/architecture-examples/jquery/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('#appIsReady').then(element => {
            const newTodo = contentDocument.getElementById('new-todo');
            newTodo.focus();
            return newTodo;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                triggerEnter(newTodo, 'keyup');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (newTodo, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.getElementsByClassName('toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingAllItems', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++)
                contentDocument.querySelector('.destroy').click();
        }),
    ]
})

Suites.push({
    name: 'Preact-TodoMVC',
    url: 'todomvc/architecture-examples/preact/dist/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                triggerEnter(newTodo, 'keydown');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});

Suites.push({
    name: 'Inferno-TodoMVC',
    url: 'todomvc/architecture-examples/inferno/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('change', {
                  bubbles: true,
                  cancelable: true
                }));
                triggerEnter(newTodo, 'keydown');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            const checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            const deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < numberOfItemsToAdd; i++)
                contentDocument.querySelector('.destroy').click();
        }),
    ]
});

function processElmWorkQueue(contentWindow) {
    contentWindow.elmWork();
    const callbacks = contentWindow.rAFCallbackList;
    let i = 0;
    while (i < callbacks.length) {
        callbacks[i]();
        i++;
    }
    contentWindow.rAFCallbackList = [];
}

Suites.push({
    name: 'Elm-TodoMVC',
    url: 'todomvc/functional-prog-examples/elm/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('.new-todo').then(element => {
            element.focus();
            return element;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                newTodo.dispatchEvent(new Event('input', {
                  bubbles: true,
                  cancelable: true
                }));
                processElmWorkQueue(contentWindow);
                triggerEnter(newTodo, 'keydown');
                processElmWorkQueue(contentWindow);
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            let checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++) {
                checkboxes[i].click();
                processElmWorkQueue(contentWindow);
            }
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                contentDocument.querySelector('.destroy').click();
                processElmWorkQueue(contentWindow);
            }
        }),
    ]
});

Suites.push({
    name: 'Flight-TodoMVC',
    url: 'todomvc/dependency-examples/flight/flight/index.html',
    prepare(runner, contentWindow, contentDocument) {
        return runner.waitForElement('#appIsReady').then(element => {
            const newTodo = contentDocument.getElementById('new-todo');
            newTodo.focus();
            return newTodo;
        });
    },
    tests: [
        new BenchmarkTestStep('Adding' + numberOfItemsToAdd + 'Items', (newTodo, contentWindow, contentDocument) => {
            for (let i = 0; i < numberOfItemsToAdd; i++) {
                newTodo.value = 'Something to do ' + i;
                triggerEnter(newTodo, 'keydown');
            }
        }),
        new BenchmarkTestStep('CompletingAllItems', (params, contentWindow, contentDocument) => {
            let checkboxes = contentDocument.querySelectorAll('.toggle');
            for (let i = 0; i < checkboxes.length; i++)
                checkboxes[i].click();
        }),
        new BenchmarkTestStep('DeletingItems', (params, contentWindow, contentDocument) => {
            let deleteButtons = contentDocument.querySelectorAll('.destroy');
            for (let i = 0; i < deleteButtons.length; i++)
                deleteButtons[i].click();
        }),
    ]
});
