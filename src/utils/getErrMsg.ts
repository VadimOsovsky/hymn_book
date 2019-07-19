import _ from "lodash";
import i18n from "../i18n";

export default function(err: any): string {
  console.log("VO: ERROR:", err, err.response);
  if (err && err.response && err.response.data && err.response.data.message && _.isString(err.response.data.message)) {
    return err.response.data.message;
  } else if (err && _.isString(err.message)) {
    return err.message;
  } else if (_.isString(err)) {
    return err;
  } else {
    return i18n.t("unknown_error");
  }
}
