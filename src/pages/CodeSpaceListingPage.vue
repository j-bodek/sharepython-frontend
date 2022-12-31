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
            <div v-if="num_pages > 1" class="text-center mt-4">
                <nav aria-label="Codespaces Pagination">
                    <MDBPagination class="justify-content-center">
                        <MDBPageItem v-for="[num, link] in pages" :active="num == current_page ? true : false"
                            @click="updateCodeSpaces(link)">
                            {{ num }}</MDBPageItem>
                    </MDBPagination>
                </nav>
            </div>
        </div>
    </div>
</template>
<script>
import {
    MDBTable,
    MDBBtn,
    MDBBadge,
    MDBPagination,
    MDBPageNav,
    MDBPageItem
} from 'mdb-vue-ui-kit';
import moment from 'moment';
import axios from 'axios';
import _ from 'lodash';

export default {
    name: "CodeSpaceListingPage",
    components: {
        MDBTable,
        MDBBtn,
        MDBBadge,
        MDBPagination,
        MDBPageNav,
        MDBPageItem
    },
    data() {
        return {
            page_size: 5,
            current_page: 1,
            num_pages: 0,
            codespaces: [],
            visible_fields: [["Name", "name"], ["Created", "created_at"], ["Updated", "updated_at"]],
            query_fields: ["uuid", "name", "created_at", "updated_at"]
        }
    },
    mounted() {
        let fields_query_param = this.query_fields.join(",");
        let url = `codespaces/?fields=${fields_query_param}&page_size=${this.page_size}`;
        this.updateCodeSpaces(url);

    },
    computed: {
        pages() {
            let num_buttons = 3;
            let start = 0;
            if (this.current_page <= ((num_buttons - 1) / 2)) {
                start = 1;
            } else if (this.current_page + ((num_buttons - 1) / 2) > this.num_pages) {
                start = Math.max(1, this.num_pages + 1 - num_buttons);
            } else {
                start = this.current_page - ((num_buttons - 1) / 2);
            }

            return _.range(start, Math.min(start + num_buttons, this.num_pages + 1)).map(page => {
                return [
                    page, `codespaces/?fields=${this.query_fields.join(",")}&page=${page}&page_size=${this.page_size}`
                ]
            });
        }
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
                            // update codespaces
                            let url = `codespaces/?fields=${this.query_fields.join(",")}&page=${this.current_page}&page_size=${this.page_size}`;
                            this.updateCodeSpaces(url);
                        }
                    })
            }
        },
        openCodeSpace(uuid) {
            this.$router.push({
                name: "codespace_with_uuid",
                params: { uuid: uuid }
            })
        },
        updateCodeSpaces(url) {
            axios.get(url)
                .catch(err => {
                    this.$router.push("/");
                    alert(err.response.data.detail);
                }).then(response => {
                    if (response) {
                        this.current_page = response.data.current_page;
                        this.num_pages = response.data.num_pages;
                        this.codespaces = response.data.results.map(codespace => {
                            codespace.created_at = moment(codespace.created_at).fromNow();
                            codespace.updated_at = moment(codespace.updated_at).fromNow();
                            return codespace;
                        });
                    }
                })
        }
    }
}
</script>

<style>
.page-item a {
    color: white !important;
    cursor: pointer !important;
}

.page-item.active a {
    color: black !important;
}

.page-item a:hover {
    background-color: rgba(255, 255, 255, 0.1) !important
}

.page-item.active a:hover {
    background-color: #e3ebf7 !important;
}
</style>
