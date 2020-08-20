<template>
    <div>请稍等</div>
</template>

<script>
    export default {
        name: "RouterToCallBack",
        created:function () {

            let href = window.location.href;
            localStorage.setItem("href",href);
            let start = href.indexOf("?");
            let end = href.indexOf("#");
            let subHref = href.slice(start+1,end);
            let code = subHref.split("=")[1];

            window.navigate(`http://112.124.17.27/#/callback?code=${code}`);
        }
    }
</script>

<style scoped>

</style>