/* eslint "react/prop-types": "warn" */
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import S from "./List.css";

import Icon from "./Icon.jsx";

import cx from "classnames";
import pure from "recompose/pure";

//TODO: extend this to support functionality required for questions
const Item = ({ name, description, placeholder, url, icon, isEditing, field }) =>
    <div className={cx(S.item)}>
        <div className={S.leftIcons}>
            { icon && <Icon className={S.chartIcon} name={icon} width={40} height={40} /> }
        </div>
        <div className={S.itemBody}>
            <div className={S.itemTitle}>
                { url ?
                    <Link to={url} className={S.itemName}>{name}</Link> :
                    <span className={S.itemName}>{name}</span>
                }
            </div>
            <div className={cx(S.itemSubtitle, { "mt1" : true })}>
                { isEditing ?
                    <textarea
                        className={S.itemTextArea}
                        placeholder={placeholder}
                        {...field}
                        defaultValue={description}
                    /> :
                    description || placeholder || 'No description yet'
                }
                { isEditing && field.error && field.touched &&
                    <span className="text-error">{field.error}</span>
                }
            </div>
        </div>
    </div>

Item.propTypes = {
    name:               PropTypes.string.isRequired,
    url:                PropTypes.string,
    description:        PropTypes.string,
    placeholder:        PropTypes.string,
    icon:               PropTypes.string,
    isEditing:          PropTypes.bool,
    field:              PropTypes.object
};

export default pure(Item);
