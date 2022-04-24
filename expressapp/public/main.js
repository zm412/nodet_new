function fetchDataPost(obj) {
  return fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(obj),
  }).then((r) => r.json());
}
const countries = (() => {
  function collectedFunc(
    listSelector,
    paginatSelector,
    inputsSelector,
    items_type
  ) {
    let page_num = 1;
    let limit = 5;
    let quantity;

    for (let i of document.querySelectorAll(inputsSelector)) {
      if (i.checked) limit = i.value;
    }

    get_list_items();

    async function get_list_items() {
      let items_list = document.querySelector(listSelector);
      items_list.innerHTML = "";
      let sample =
        items_type == "country"
          ? "getCountriesByPages"
          : "getSatellitesByPages";

      let query = `query ${sample}($page_num: Int!, $limit: Int!){
          ${sample}(page_num: $page_num, limit_num: $limit){
              _id, name, type, count
            }
        }`;

      let param_obj = {
        query,
        variables: { page_num: Number(page_num), limit: Number(limit) },
      };

      const _res_json = fetchDataPost(param_obj).then((doc) => {
        doc.data[sample].map((n) =>
          createButton(items_list, `${n.name}, id: ${n._id}`, "li")
        );
        quantity = doc.data[sample][0].count;
        get_pagination(
          paginatSelector,
          limit,
          quantity,
          page_num,
          funcPrev,
          funcNext
        );
      });

      const funcPrev = () => {
        page_num--;
        get_list_items();
      };

      const funcNext = () => {
        page_num++;
        get_list_items();
      };
    }
  }

  document
    .querySelector("#get_countries_button")
    .addEventListener("click", (e) => {
      collectedFunc(
        "#country_list",
        "#paginat_system",
        ".quantity_i",
        "country"
      );
    });

  document
    .querySelector("#get_satellites_button")
    .addEventListener("click", (e) => {
      collectedFunc(
        "#satellite_list",
        "#paginat_system2",
        ".quantity_n",
        "satellite"
      );
    });

  function get_pagination(
    paginate_sys_selector,
    limit,
    quantity,
    page_num,
    funcPrev,
    funcNext
  ) {
    let last_page = Math.ceil(quantity / limit);
    let pag_sys = document.querySelector(paginate_sys_selector);
    pag_sys.innerHTML = "";

    if (quantity > limit && page_num > 1) {
      createButton(pag_sys, "Prev", "button", funcPrev);
    }

    if (quantity > limit && page_num < last_page) {
      createButton(pag_sys, "Next", "button", funcNext);
    }
  }

  function createButton(par, inner, tag, func) {
    let button = document.createElement(tag);
    par.appendChild(button);
    button.innerHTML = inner;
    button.onclick = func;
  }

  document.querySelector("#search_form").onsubmit = (e) => {
    let ul = document.querySelector("#search_list");
    ul.innerHTML = "";
    e.preventDefault();
    let sample = "searchItemByName";
    let str = document.querySelector("#search_key").value;
    let query = `query ${sample}($str: String!){
            ${sample}(str: $str){
              ...on Satellite{
                _id, name
              }
              ...on Country{
                _id, name
              }
            }
        }`;

    let param_obj = { query, variables: { str } };
    fetchDataPost(param_obj).then((doc) => {
      doc.data[sample].map((n) =>
        createButton(ul, `${n.name}, id: ${n._id}`, "li")
      );
    });
  };

  document.querySelector("#get_country").onsubmit = (e) => {
    e.preventDefault();
    let div = document.querySelector("#country_info");
    div.innerHTML = "";
    let sample = "getCountry";
    let id = document.querySelector("#id_country").value;
    let query = `query getCountry ($id: ID!){
          getCountry(id: $id){
            name, _id
            },

          getSatellitesByCountryId(country_id: $id){
            name, _id
          }
      }
`;

    let param_obj = { query, variables: { id } };
    fetchDataPost(param_obj)
      .then((doc) => {
        let n = doc.data.getCountry;
        let sats = doc.data.getSatellitesByCountryId;
        createButton(div, `${n.name}, id: ${n._id}`, "p");
        if (sats.length > 0) {
          sats.map((p) => createButton(div, `${p.name}, id: ${p._id}`, "li"));
        }
      })
      .catch((err) => console.log(err, "err"));
  };

  document.querySelector("#get_satellite").onsubmit = (e) => {
    e.preventDefault();
    let div = document.querySelector("#satellite_info");
    div.innerHTML = "";
    let sample = "getSatellite";
    let id = document.querySelector("#id_satellite").value;
    let query = `query ${sample}($id: ID!){
          ${sample}(id: $id){
            name, _id, countries_docs {
            name, _id
            }
          }
      }`;

    let param_obj = { query, variables: { id } };
    fetchDataPost(param_obj).then((doc) => {
      let n = doc.data[sample];
      createButton(div, `${n.name}, id: ${n._id}`, "span");
      if (n.countries_docs.length > 0) {
        n.countries_docs.map((p) =>
          createButton(div, `${p.name}, id: ${p._id}`, "li")
        );
      }
    });
  };
})();
