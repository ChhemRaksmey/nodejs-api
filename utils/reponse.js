module.exports = {

    format ({ header={}, overrides={}, errors={}, body={}, } = {}) {

        const response = {};

        if (header) { response.header = header; }
        if (overrides) { response.header = overrides; }
        if (errors) { response.header = errors; }
        if (body) { response.body = body; }

        return response;
    },

}