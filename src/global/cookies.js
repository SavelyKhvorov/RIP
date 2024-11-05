const cookies = {
  get(name) {
    let matches = document.cookie.match(
      new RegExp(
        "(?:^|; )"+
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]): undefined;
  },

  set(name, value, options = {}) {
    options = {
      path: "/",
      "max-age": 60 * 60 * 24 * 30 * 12,
      ...options,
    };

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    let updatedCookies = 
      encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookies += "; " + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookies += "=" + optionValue;
      }
    }
    document.cookie = updatedCookies;
  },
  delete(name) {
    setCookie(name, "", {
      "max-age": -1,
    });
  },
};

export {cookies as default}