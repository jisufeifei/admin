<template>
    <div>
        这是About页面
        <el-button type="primary">主要按钮</el-button>
        <AboutComponents></AboutComponents>
    </div>
</template>
<script>
import AboutComponents from "@/components/AboutComponents"
export default {
    name: "About",
    components: {
        AboutComponents
    }
}
</script>