---
outline: deep
---

# Button 按钮

常用的操作按钮。

```vue
<template>
  <Button>按钮</Button>
</template>
<script setup lang="ts">
import { Button } from 'dgb-ui/admin'
</script>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
