<template>
    <div class="bg-dark text-light h-100 d-flex" style="height: 100vh !important">
        <div class="text-start w-100 mx-auto" style="margin: 100px 0px;">
            <h2 class="text-center text-decoration-underline mb-4">Your CodeSpaces</h2>
            <div v-if="codespaces.length > 0" class="px-3">
                <MDBTable dark hover class="align-middle mb-0 bg-white">
                    <thead class="bg-light">
                        <tr>
                            <th v-for="[field_name, field_key] in visible_fields">{{ field_name }}</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="codespace in codespaces" @click="openCodeSpace(codespace.uuid)"
                            style="cursor:pointer">
                            <td v-for="[field_name, field_key] in visible_fields">
                                {{ codespace[field_key] }}
                            </td>
                            <td>
                                <MDBBtn key="delete-btn" color="danger" size="sm" rounded
                                    @click.stop="deleteCodespace(codespace.uuid)">
                                    <span class="d-flex">
                                        Delete
                                        <i class="fa-solid fa-trash my-auto ms-2"></i>
                                    </span>
                                </MDBBtn>
                            </td>
                        </tr>

                    </tbody>
                </MDBTable>
            </div>
            <div v-else class="px-3 text-center">
                You don't have any CodeSpaces
            </div>
        </div>
    </div>
</template>
<script>
import {
    MDBTable,
    MDBBtn,
    MDBBadge
} from 'mdb-vue-ui-kit';
import moment from 'moment';
import axios from 'axios';

export default {
    name: "CodeSpaceListingPage",
    components: {
        MDBTable,
        MDBBtn,
        MDBBadge
    },
    data() {
        return {
            codespaces: [],
            visible_fields: [["Name", "name"], ["Created", "created_at"], ["Updated", "updated_at"]],
            query_fields: ["uuid", "name", "created_at", "updated_at"]
        }
    },
    mounted() {
        let fields_query_param = this.query_fields.join(",");
        axios.get(`codespaces/?fields=${fields_query_param}`)
            .catch(err => {
                this.$router.push("/");
                alert(err.response.data.detail);
            }).then(response => {
                if (response) {
                    this.codespaces = response.data.map(codespace => {
                        codespace.created_at = moment(codespace.created_at).fromNow();
                        codespace.updated_at = moment(codespace.updated_at).fromNow();
                        return codespace;
                    });
                }
            })
    },
    methods: {
        deleteCodespace(uuid) {
            let confirmed = confirm("Are you sure you want to delete this codespace?");
            if (confirmed) {
                axios.delete(`codespace/${uuid}/`)
                    .catch(err => {
                        alert(err.response.data.detail);
                    }).then(response => {
                        if (response) {
                            this.codespaces = this.codespaces.filter(codespace => codespace.uuid !== uuid);
                        }
                    })
            }
        },
        openCodeSpace(uuid) {
            this.$router.push({
                name: "codespace_with_uuid",
                params: { uuid: uuid }
            })
        }
    }
}
</script>
