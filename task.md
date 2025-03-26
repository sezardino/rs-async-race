# Decision Making Tool

## Description

Your task is to implement a single page application (SPA) for decision making.
This application is designed to help streamers, content makers, tabletop role-players to make random pick based on the weight of an option (it increases the chance of an option being picked).

The application consists of two parts: `List of Options` and `Decision Picker`.

The first part of the application (`List of Options`) allows you to edit the list of options, as well as to save it to a file and load it from a file. There is also a button to go to the second part of the application (`Decision Picker`).

The second part of the application (`Decision Picker`) allows you to visualize the previously created list. There is also an element for displaying the picked option, a button to start the picking process and a user-friendly option to return to the first part of the application (`List of Options`).

## Task Objectives

- Acquire or refine skills in creating, modifying, and deleting HTML elements dynamically using code.
- Practice on implementing SPA with seamless navigation between different parts of the application _(e.g., via `Hash Router`/`History Api Router` strategy)_.
- Practice storing user input between sessions _(e.g., via `Web Storage API`)_.
- Learn to collect and save user input data to a file.
- Learn to load and process data from a file _(e.g., via `File API`)_.
- Familiarize yourself with Canvas API.
- Practice with animations. _(e.g., via `Web API`'s `requestAnimationFrame`, `Animations API`, etc.)_
- Familiarize yourself with setting up project configurations.
- Familiarize yourself with writing clean code with strict rules.

## General Requirements

- `<body>` in the `index.html` must be empty (only `<script>` tag is allowed). _(You can check this with the `View page source` option in the context menu in Google Chrome.)_
- App must be supported at `640px <= width <= 1280px` at least _(DOM elements should not go out of bounds of parent elements, overlap, etc.)_.
- The use of `alert`, `prompt`, `confirm` is prohibited.
- App must not have unexpected errors in the console.
- The app must be supported by at least the latest version of the Google Chrome browser.

### List of Options (108 points)

> List of Options consists of app's name, [`List`](#list-9108) with [`Options`](#option-22108) and a panel with [`Buttons`](#buttons-34108) for interacting with the list and navigation.

#### General (9/108)

1. (+1) Displays the app's name.
2. (+2) `List of Options` must be directly accessible via a direct link.
3. (+4) The URL must be relevant to the content displayed if the user reached it through an interactive element within the application.
4. (+2) The URL must not change when the page is manually reloaded.

#### List (9/108)

1. (+1) Displays the [`List`](#list-9108) with [`Options`](#option-22108).
2. (+2) In the `initial state`, the list contains exactly 1 empty option _(`{"id": "#1", "title": "", "weight": ""}`)_. _The `initial state` here means the state of the application when the user first encounters it (this can be simulated by pre-closing all current incognito tabs, if any, and opening a new one._
3. (+2) Current options must be persisted _(not reset, not shuffled)_ when the page is reloaded.
4. (+2) Current options must be persisted _(not reset, not shuffled)_ when the tab/window is closed and a new one is opened.
5. (+2) Current options must be persisted _(not reset, not shuffled)_ when the user is navigated to another route and then back again.

#### Option (22/108)

> Refers to any displayed options in the list, including all created and inserted options.

##### `id`

> `id` - is a constant [unique identifier](https://en.wikipedia.org/wiki/Unique_identifier) (not just a sequence number).

1. (+1) Each option's `id` must be displayed.
2. (+2) Each option's `id` must be unique.
3. (+2) Each option's `id` must be in `#n` format _(`#1`, `#2`, `#3`, and so on)_.
4. (+2) Each option's `id` must be generated programmatically at creation _(user cannot change it directly in this element)_.
5. (+1) Each option's `id` must be constant and not affected by deletion of any other option.
6. (+1) When the list of options becomes completely empty, the `id` counter must be reset.

##### `title`

1. (+1) Each option's `title` must be displayed.
2. (+2) Each option's `title` must be able to be edited by the user.

##### `weight`

1. (+1) Each option's `weight` must be displayed.
2. (+2) Each option's `weight` must be able to be edited by the user.
3. (+2) Each option's `weight` must take only numbers.

##### `delete button`

1. (+1) Each option's `delete button` must be displayed. The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "delete", "remove", etc.)_.
2. (+2) Option's `delete button` click must delete the current option from the list.

##### Option columns

1. (+2) The width of the "columns" ([`id`](#id), [`title`](#title), [`weight`](#weight), [`delete button`](#delete-button)) should match in "rows" ([`option`](#option-22108)). _(`flex`/`grid`/`table` can be useful here. How you do it is up to you.)_

#### Buttons (34/108)

##### Add option

1. (+1) Displays an `add option button` for creating a "new option". The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "add option", "new option", "+", etc.)_.
2. (+2) The `add option button` click must create a "new option" _(empty `title`, empty `weight`)_ and add it to the bottom of the list.

##### Paste list

1. (+1) Displays a `paste list button` for displaying the [`paste list` modal window](#paste-list-modal). The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "paste list", "load list from clipboard", etc.)_.
2. (+2) The `paste list button` click must open the `paste list` modal window.

##### Clear list

1. (+1) Displays a `clear list button` for removing all options from the list. The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "clear list", "reset list", etc.)_.
2. (+2) The `clear list button` click must remove all current options from the list.

##### Save list to json

1. (+1) Displays a `save list button` for saving all current options to the `.json` file. The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "save list to file", "save list as json", etc.)_.
2. (+4) The `save list button` click must collect the all current options data, convert it to a json object and save it to a `.json` file.
3. (+2) The `id`, `title` and `weight` values of options must be saved.
4. (+2) The order of options in the file must match the order of options in the app.

##### Load list from json

1. (+1) Displays a `load list button` for loading options from the `.json` file. The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "load list from file", "load list from json", etc.)_.
2. (+2) The `load list button` click must open the interface to select the file.
3. (+2) The type of files to be selected must be limited to a single file of type `.json`.
4. (+4) The current list of options must be completely replaced by the list from the `.json` file you uploaded _(your app must be able to read and correctly parse the file created by your `save list button` click)_.
5. (+2) The order of options in the app must match the order of options in the file.

##### Start

1. (+1) Displays a `start button` for navigating to the [`Decision picker` route](#decision-picker-143-points). The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "start", "pick decision", "open decision picker", etc.)_.
2. (+2) The `start button` click must navigate to the `Decision picker` route if there are at least two `valid options`. _An option is considered valid if its [`title`](#title) is not empty and its [`weight`](#weight) is greater than `0`._
3. (+2) The `start button` click must open the [`add valid options` modal window](#add-valid-options-modal), instructing the user to add at least two `valid options` if there are less than two `valid options` in the list. _An option is considered valid if its [`title`](#title) is not empty and its [`weight`](#weight) is greater than `0`._

#### Modal windows (34/108)

> Great place to get familiar with the `<dialog>` element, but the old-fashioned `div.modal>div.modal-content` pattern is ok too as long as it meets the requirements

##### Paste list modal

1. (+1) The `paste list` modal window must display a `paste field` element for inserting new options data as text in a CSV-like format
2. (+1) The `paste list` modal window should display its `confirm button`. The appearance of this button should clearly indicate its purpose _(contain appropriate text or icon. e.g., "Confirm", "Submit", "✔", etc.)_.
3. (+1) The `paste list` modal window should display its `cancel button`. The appearance of this button should clearly indicate its purpose _(contain appropriate text or icon. e.g., "Cancel", "Close", "⨉", "x", etc.)_.
4. (+2) The `paste field` element must be able to be edited by the user.
5. (+8) The `confirm button` click must parse the text from the `paste field`, create `new options` from that data and add those `new options` to the bottom of the list as well as close the `paste list` modal window.
6. (+2) The `cancel button` click must close the `paste list` modal window without affecting the list.
7. (+2) The `escape key press` must close the `paste list` modal window without affecting the list.
8. (+2) The `outside click` must close the `paste list` modal window without affecting the list.
9. (+2) An opened `paste list` modal window must block the page scrolling until the modal window is closed.
10. (+2) Closing `paste list` modal window must also remove it from the DOM.

##### Add valid options modal

1. (+1) The `add valid options` modal window should display its `close button`. The appearance of this button should clearly indicate its purpose _(contain appropriate text or icon. e.g., "Close", "Cancel", "⨉", "x", etc.)_.
2. (+2) The `close button` click must close the modal window.
3. (+2) The `escape key press` must close the modal window.
4. (+2) The `outside click` must close the modal window.
5. (+2) An opened `add valid options` modal window must block the page scrolling until the modal window is closed.
6. (+2) Closing `add valid options` modal window must also remove it from the DOM.

### Decision Picker (143 points)

> Decision picker consists of app's name, [`Wheel`](#wheel-73143) canvas, [`Picked option`](#picked-option-13143) displaying element and a panel with [`Buttons`](#interactions-42143) for interacting and navigation.
> The `Wheel` element displays the filtered list of `valid options` from the `List of Options` as sections of a circle (`option sections`) of different widths. The width of the section depends on the `weight` value. The color of the section is randomized when `Decision Picker` is opened.
>
> Briefly, the states mentioned below are:
>
> 1. `Decision Picker` opened - the decision picker is in the `initial state`.
> 2. A successful start of picking process has been initiated - the decision picker is in the `picking state`.
> 3. The picking process has finished and the picked option has been determined - the decision picker is in the `picked state`.
>
> After that `picking state` and `picked state` cyclically change each other according to points 2 and 3.
>
> If the `Decision Picker` was closed and reopened, the life cycle starts again with `initial state`.

#### General (15/143)

1. (+1) Displays the app's name.
2. (+4) `Decision Picker` must be directly accessible via a direct link.
3. (+4) User must be redirected to `List of Options` if there are less than two `valid options` to display. _An option is considered valid if its [`title`](#title) is not empty and its [`weight`](#weight) is greater than `0`._
4. (+4) The URL must be relevant to the content displayed if the user reached it through an interactive element within the application.
5. (+2) The URL must not change when the page is manually reloaded.

#### Interactions (42/143)

##### Back

1. (+1) Displays a `back button` for navigating to the [`List of Options` route](#decision-picker-143-points). The appearance of this button should clearly indicate its purpose _(contain appropriate text or icon. e.g., "Back", "⬅", "↖", "🏠" etc.)_.
2. (+2) The `back button` click must navigate to the `List of Options` route.
3. (+2) In the `picking state` `back button` must be temporarily visually disabled and must not be functioning.
4. (+2) In the `initial and picked states` `back button` returns to its original state and functions as it should.

##### Sound

1. (+1) Displays a `sound button` for toggling sound on/off. The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "sound: on", "sound: off", "🔊", "🔇", etc.)_.
2. (+2) The `sound button` click must toggle sound on/off.
3. (+2) The `sound button` appearance must correspond to the current `mute state` (dynamically). _This means that if the sound is muted, the button shows that it is muted and vice versa._
4. (+2) The `mute state` must be persisted when the page is reloaded.
5. (+2) The `mute state` must be persisted when the tab/window is closed and a new one is opened.
6. (+2) The `mute state` must be persisted when the user is navigated to another route and then back again.
7. (+2) In the `picking state` `sound button` must be temporarily visually disabled and must not be functioning.
8. (+2) In the `initial and picked states` `sound button` returns to its original state and functions as it should.

##### Duration

1. (+1) Displays a `duration` `<input>` element for setting the rotation duration in seconds. The appearance of this input should clearly indicate its purpose _(contain appropriate label and/or placeholder. e.g., "⏲", "duration", "time", "seconds", etc.)_
2. (+2) `duration` element must be able to be edited by the user.
3. (+2) `duration` element must take only numbers.
4. (+2) `duration` element must have a default value, which should be between 5 and 30 seconds.
5. (+2) In the `picking state`, `duration` element must be temporarily visually disabled and must not be functioning.
6. (+2) In the `initial and picked states` `duration` element returns to its original state and functions as it should.

##### Pick

1. (+1) Displays a `pick button` for start picking process. The appearance of this button should clearly indicate its purpose _(contain appropriate text and/or icon. e.g., "▶", "pick", "start", etc.)_.
2. (+2) The `pick button` click must initiate the picking process if the `duration` input value is greater than five seconds inclusive.
3. (+2) The `pick button` click must notify the user of an incorrect input. _(the default form validation is enough, but you can implement a custom one if you want.)_
4. (+2) In the `picking state`, `pick button` must be temporarily visually disabled and must not be functioning.
5. (+2) In the `initial and picked states` `pick button` returns to its original state and functions as it should.

#### Picked option (13/143)

1. (+1) Displays a `picked option` element.
2. (+2) In the `initial state`, `picked option` must display an appropriate message inviting the player to initiate the picking process.
3. (+4) In the `picking state`, `picked option` must **dynamically** display the `title` of the option currently pointed to by the wheel `cursor`.
4. (+2) In the `picked state`, `picked option` must display the `title` of the option currently pointed to by the wheel `cursor`.
5. (+2) In the `initial and picking states`, the `picked option` must not be highlighted.
6. (+2) In the `picked state`, the `picked option` must be highlighted.

#### Wheel (73/143)

> Canvas API and requestAnimationFrame are very good for this part of the assignment.

##### General

1. (+1) Displays the `wheel` element as a single `<canvas>` element.

##### Option section

1. (+2) The `wheel` element must display `valid options` from the `List of Options` as sections of a circle.
2. (+4) The order of `option sections` on the `wheel` element must be randomized when the `Decision Picker` is opened and not change until it is closed.
3. (+4) The fill color of each `option section` must be randomly generated when the `Decision Picker` is opened and not change until it is closed.
4. (+8) The width (angle) of each `option section` must depend on the `weight` field of the option. _The main idea of this feature is that by setting the weight value of the option we can adjust the chance of that particular option being picked. That is, the higher the weight of the option, the wider its section, and therefore the higher the chance of being picked._
5. (+2) Each `option section` must have a visual boundary to distinguish it from other elements (e.g., adjacent sections, cursor, center element), even if their fill colors are similar. _(Additional stroke, shadow, fill can be useful here.)_

##### Option section title

1. (+2) Each `option section` must display the `title` value of the option as text (except in the case described in the next bullet point). The text should be placed in the section from the center of the wheel to the edge (or from the edge to the center).
2. (+4) Each `option section title` must not violate the boundaries of its section. If the width (angle) of the section is not wide enough to display the text, the text must not be displayed.
3. (+4) Each `option section title` must not violate the boundaries of wheel. If `title` is too long, it should be clipped and end with ellipsis _(e.g., `"some very very long title" -> "some very very long t…"`)_.
4. (+2) Each displayed `option section title` must have a visual boundary to distinguish it from the randomized `option section` fill color. _(Additional stroke, shadow, fill can be useful here.)_

##### Center element

1. (+2) In the center of the `wheel`, there must be a decorative element to hide the point of contact between all the option sections _(e.g., a small circle, star, image, etc.)_.
2. (+2) The `center element` must have a visual boundary to distinguish it from other elements (e.g., adjacent sections), even if their fill colors are similar. _(Additional stroke, shadow, fill can be useful here.)_

##### Cursor

1. (+4) The `wheel` element must display a `cursor` that points to the current option. It can be designed in the form of a triangle, arrow or any similar figure with a clearly defined pointer.
2. (+2) The `cursor` must be placed at any position on the edge of the `wheel` and not overlapped by other elements.
3. (+2) The `cursor` must have a visual boundary to distinguish it from other elements (e.g., adjacent sections, background), even if their fill colors are similar. _(Additional stroke, shadow, fill can be useful here.)_

##### Decision Picking

1. (+2) When decision picking is initiated, the wheel must start rotating and stop after a short duration.
2. (+4) The rotation duration must be specified by the `duration` element. That is, it should correspond to its value (in seconds) at the moment of rotation start. _Be loyal when crosschecking. A small inaccuracy is acceptable. There is no need to reduce points for a difference of a couple of seconds._
3. (+4) The rotation should have a non-linear velocity. Use a suitable easing _(e.g. `ease-in-out` or `ease-in-out-back` with a tiny magnitude)_.
4. (+4) The wheel must perform several full turns (minimum 5) and stop at a random point on the circumference _(at a random position on the random option section)_.
5. (+2) A `finish sound` must be played when `picking state` is changed to `picked state` if `mute state` is toggled `on`.
6. (+2) A `finish sound` must not be played if `mute state` is toggled `off`.
7. (+4) In the `picking state`, `option sections` must not change their order, shape, color. _It means that visually the `option sections` shall rotate as an indivisible whole wheel._
8. (+4) In the `picking state`, each `option section title` shall not change its location relative to the boundaries of its `option section`. _It means that visually `option section title` and `option section` should rotate as an indivisible element._
9. (+2) In the `picking state`, the `cursor` must stay in its place and not rotate.

### Error page (4 points)

#### General (4/4)

1. (+1) Implemented `Error page` display if the user is on an unknown route.
2. (+1) The `Error page` displays a `back button` for navigating to the [`List of Options` route](#list-of-options-108-points). The appearance of this button should clearly indicate its purpose _(contain appropriate text or icon. e.g., "Back", "Back to main page", "⬅", "↖" etc.)_.
3. (+2) The `back button` click must navigate to the `List of Options` route.
