# Toast Kit

Toast Kit is a library for displaying toast messages in the browser that adapts to any JavaScript framework.

## Installation

```bash
npm install toast-kit
```

## Usage

```javascript
import { toastKit } from 'toast-kit';

toastKit.success('Success message');
toastKit.warning('Warning message');
toastKit.error('Error message');
toastKit.info('Info message');
```

## Options

You can pass an object of options as the second argument to the `toastKit` function.

```javascript
toastKit.success('Success message', { duration: 3000, position: 'top-right' });
```

## Examples

<img src="example/success.jpg" alt="Success" width="300"  />
<img src="example/warning.jpg" alt="Warning" width="300" />
<img src="example/error.jpg" alt="Error" width="300" />
<img src="example/information.jpg" alt="Information" width="300" />

The available options are:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `duration` | `number` | `3000` | The duration of the toast message in milliseconds.
| `position` | `string` | `'top-right'` | The position of the toast message. Possible values are `'top-right'`, `'top-left'`, `'bottom-right'`, `'bottom-left'`, `'top-center'`.