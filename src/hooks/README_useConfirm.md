# useConfirm Hook - Custom Confirmation Dialog

## Usage

Replace all `window.confirm()` calls throughout the app with this custom dialog.

### Basic Example:

```javascript
import { useConfirm } from '../hooks/useConfirm';

function MyComponent() {
  const { confirm } = useConfirm();

  const handleDelete = async () => {
    const result = await confirm({
      title: 'Delete Item?',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (result) {
      // User clicked "Delete" (Yes)
      await deleteItem();
    } else {
      // User clicked "Cancel" (No) or closed dialog
      console.log('Cancelled');
    }
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### Custom Buttons:

```javascript
const result = await confirm({
  title: 'Activate AutoPilot?',
  message: 'Would you like to generate content now?',
  confirmText: 'Yes, Generate',
  cancelText: 'No, Skip'
});
```

## Features:
- ✅ Beautiful dark theme matching site design
- ✅ Yes/No buttons with icons
- ✅ Promise-based API (use with async/await)
- ✅ Works anywhere in the app (global state)
- ✅ Automatically hides custom cursor
- ✅ Click outside to cancel
- ✅ Smooth animations

## Replacing window.confirm:

**Old:**
```javascript
if (window.confirm('Are you sure?')) {
  doSomething();
}
```

**New:**
```javascript
const { confirm } = useConfirm();
const result = await confirm({
  title: 'Confirm Action',
  message: 'Are you sure?'
});
if (result) {
  doSomething();
}
```
