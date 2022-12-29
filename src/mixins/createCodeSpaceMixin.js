import axios from 'axios';

export default {
    methods: {
        createCodeSpace() {
            // send request to api and create new codespace
            axios.post("codespace/", {}, {
                withCredentials: true,
            }).catch(err => {
                alert("Ops... Something went wrong.");
            }).then(response => {
                if (response) {
                    // redirect to codespace page
                    this.$store.dispatch("setCodeSpaceData", { "data": response.data });
                    this.$router.push({
                        name: "codespace",
                        params: { uuid: response.data.uuid }
                    })
                }
            });
        }
    }
}