<template>
    <div class="mb-5">
        <!-- first name, last name inputs -->
        <div class="row">
            <div class="col-md-6 col-12 mb-3">
                <mdb-input v-model="userData.first_name" class="text-white" labelClass="text-white" type="text"
                    label="First Name" outline required></mdb-input>
            </div>
            <div class="col-md-6 col-12 mb-3">
                <mdb-input v-model="userData.last_name" class="text-white" labelClass="text-white" type="text"
                    label="Last Name" outline required></mdb-input>
            </div>
        </div>
        <!-- Email input -->
        <mdb-input v-model="userData.email" class="text-white mb-3" labelClass="text-white" type="email" label="Email"
            outline required></mdb-input>

        <!-- Password input -->
        <mdb-input v-model="userData.password" class="text-white mb-3" labelClass="text-white" type="password"
            label="Password" outline required></mdb-input>
    </div>
</template>
<script>
import { MDBInput } from 'mdb-vue-ui-kit';
import { reactive } from "vue";

export default {
    name: "BaseAllUserDataForm",
    components: {
        "mdb-input": MDBInput,
    },
    props: ["user"],
    data() {
        return {
            "userData": {}
        }
    },
    mounted() {
        this.userData = reactive({
            "first_name": this.user ? this.user.first_name : "",
            "last_name": this.user ? this.user.last_name : "",
            "email": this.user ? this.user.email : "",
            "password": "",
        })
    },
    watch: {
        userData: {
            handler(val) {
                this.emitUserData();
            },
            deep: true
        },
    },
    methods: {
        emitUserData() {
            this.$emit("data", this.userData);
        }
    }
}
</script>