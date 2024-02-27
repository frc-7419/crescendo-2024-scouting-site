import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBell} from '@fortawesome/free-solid-svg-icons';

export default function Notifications() {

    return (
        <button>
            <FontAwesomeIcon icon={faBell} size="xl" fixedWidth
                             className='transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300'/>
        </button>
    );
}