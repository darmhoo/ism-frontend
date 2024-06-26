import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setAuthentication } from '@app/store/reducers/auth';
import { StyledBigUserImage, StyledSmallUserImage } from '@app/styles/common';
import {
  UserBody,
  UserFooter,
  UserHeader,
  UserMenuDropdown,
} from '@app/styles/dropdown-menus';

declare const FB: any;

const UserDropdown = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const authentication = useSelector((state: any) => state.auth.authentication);
  const profile = useSelector((state: any) => state.profile.profile);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logOut = async (event: any) => {
    event.preventDefault();
    setDropdownOpen(false);

    dispatch(setAuthentication(undefined));
    navigate('/login');

    localStorage.removeItem('authentication');
    localStorage.removeItem('profile');

  };

  const navigateToProfile = (event: any) => {
    event.preventDefault();
    setDropdownOpen(false);
    profile.is_admin ? navigate('/admin/profile') : navigate('/profile');
  };

  return (

    <UserMenuDropdown isOpen={dropdownOpen} hideArrow>
      <StyledSmallUserImage
        slot="head"
        src={profile?.picture}
        fallbackSrc="/img/default-profile.png"
        alt="User"
        width={25}
        height={25}
        rounded
      />
      <div slot="body">
        <UserHeader className=" bg-primary">
          <StyledBigUserImage
            src={profile?.picture}
            fallbackSrc="/img/default-profile.png"
            alt="User"
            width={90}
            height={90}
            rounded
          />
          <p>
            {profile?.email}

          </p>
        </UserHeader>

        <UserFooter>
          <button
            type="button"
            className="btn btn-default btn-flat"
            onClick={navigateToProfile}
          >
            {t('header.user.profile')}
          </button>
          <button
            type="button"
            className="btn btn-default btn-flat float-right"
            onClick={logOut}
          >
            {t('login.button.signOut')}
          </button>
        </UserFooter>
      </div>
    </UserMenuDropdown>
  );
};

export default UserDropdown;
