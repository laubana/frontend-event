import { ChangeEvent, useEffect, useRef, useState } from "react";
import HomeView from "./Home.view";
import { useMediaQuery } from "react-responsive";
import Geocode from "react-geocode";
import { UseSearchContext } from "../../../context/SearchContext";
import { Location } from "../../../type/Location";
import { Group } from "../../../type/Group";
import { HomeProps } from "./Home.props";
import { MapRef } from "react-map-gl";
import { Place } from "../../../type/Place";
import { Option } from "../../../type/Option";
import { Category } from "../../../type/Category";

const Home = (): JSX.Element => {
  const mapRef = useRef<MapRef | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>();
  const [currentLocation, setCurrentLocation] = useState<Location>();

  const [categories, setCategories] = useState<Category[]>();
  const [unpagedGroups, setUnpagedGroups] = useState<Group[]>();
  const [pagedGroups, setPagedGroups] = useState<Group[]>();
  const [currentGroupPage, setCurrentGroupPage] = useState<number>(1);
  const [hasMoreGroups, setHasMoreGroups] = useState<boolean>(true);

  const [searchCategoryPk, setSearchCategoryPk] = useState<string>();
  const { searchGroupName } = UseSearchContext();
  const [searchLocation, setSearchLocation] = useState<Location>();
  const [searchDistance, setSearchDistance] = useState<string>("50");

  const [popup, setPopup] = useState<Group>();

  const isMobileDevice = useMediaQuery({ maxWidth: 767 });
  const isTabletDevice = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  const isDesktopDevice = useMediaQuery({ minWidth: 992 });

  const handleOnScroll = () => {
    setCurrentGroupPage((oldValue) => oldValue + 1);
  };

  const handleOnOpenPopup = (group: Group) => {
    setPopup({
      groupPk: group.groupPk,
      groupName: group.groupName,
      groupLocationLatitude: group.groupLocationLatitude,
      groupLocationLongitude: group.groupLocationLongitude,
    });

    mapRef.current?.flyTo({
      center: [group.groupLocationLongitude, group.groupLocationLatitude],
      duration: 500,
    });
  };

  const handleOnClosePopup = () => {
    setPopup(undefined);
  };

  const handleOnChangePk = (option: Option) => {
    setSearchCategoryPk(option.value);
  };

  const handleOnChangeLocation = (place: Place) => {};

  const handleOnChangeDistance = (option: Option) => {
    setSearchDistance(option.value);
  };

  useEffect(() => {
    const main = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS || "");
          Geocode.setLanguage("en");
          const addressResponse = await Geocode.fromLatLng(
            position.coords.latitude.toString(),
            position.coords.longitude.toString()
          );
          const currentAddress = addressResponse.results[0].formatted_address;
          setCurrentAddress(currentAddress);
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (_) => {
          setCurrentAddress("");
          setCurrentLocation({
            latitude: 49.2827291,
            longitude: -123.1207375,
          });
        }
      );

      const categoriesResponse = await fetch("/square/group/get_category_list");
      const categoryItems = await categoriesResponse.json();
      setCategories(categoryItems);
    };
    main();
  }, []);

  useEffect(() => {
    const main = async () => {
      const groupsResponse = await fetch(
        `/square/group/get_group_list?groupCategoryPk=${
          searchCategoryPk ? searchCategoryPk : ""
        }&groupName=${
          searchGroupName ? searchGroupName : ""
        }&groupLocationLatitude=${
          searchLocation ? searchLocation.latitude : ""
        }&groupLocationLongitude=${
          searchLocation ? searchLocation.longitude : ""
        }&distance=${searchDistance}`
      );
      const groupItems = await groupsResponse.json();
      setUnpagedGroups(groupItems);

      setCurrentGroupPage(1);

      // setHasMore(true);

      // if (groupItems.length === 0) {
      //   setHasMore(false);
      // } else {
      //   setHasMore(true);
      // }
    };
    main();
  }, [searchCategoryPk, searchGroupName, searchLocation, searchDistance]);

  useEffect(() => {
    const main = async () => {
      if (unpagedGroups) {
        setPagedGroups(unpagedGroups.slice(0, 4 * currentGroupPage));

        if (Math.ceil(unpagedGroups.length / 4) <= currentGroupPage) {
          setHasMoreGroups(false);
        } else {
          setHasMoreGroups(true);
        }
      }
    };
    main();
  }, [unpagedGroups, currentGroupPage]);

  const props: HomeProps = {
    mapRef: mapRef,
    currentAddress: currentAddress,
    currentLocation: currentLocation,

    categories: categories,
    pagedGroups: pagedGroups,
    hasMoreGroups: hasMoreGroups,

    popup: popup,

    handleOnScroll: handleOnScroll,
    handleOnOpenPopup: handleOnOpenPopup,
    handleOnClosePopup: handleOnClosePopup,
    handleOnChangePk: handleOnChangePk,
    handleOnChangeLocation: handleOnChangeLocation,
    handleOnChangeDistance: handleOnChangeDistance,

    isMobileDevice: isMobileDevice,
    isTabletDevice: isTabletDevice,
    isDesktopDevice: isDesktopDevice,
  };
  return <HomeView {...props} />;
};

export default Home;
