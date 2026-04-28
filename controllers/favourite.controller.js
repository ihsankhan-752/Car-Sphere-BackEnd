import {
  addListingToFavouriteService,
  getUserFavouriteServices,
  removeListingFromFavouriteService,
} from "../services/favourite.services.js";

export const addListingToFavouriteController = async (req, res, next) => {
  try {
    const { listingId } = req.body;

    const newFavourite = await addListingToFavouriteService(
      req.user.userId,
      listingId,
    );

    return res.status(201).json({
      success: true,
      message: `Listing Added Successfully`,
      data: newFavourite,
    });
  } catch (error) {
    return next(error);
  }
};

export const getListingFromFavouriteController = async (req, res, next) => {
  try {
    const favourites = await getUserFavouriteServices(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Favourites fetched successfully",
      data: favourites,
    });
  } catch (error) {
    return next(error);
  }
};

export const removeListingFromFavouriteController = async (req, res, next) => {
  try {
    const { id } = req.params;

    await removeListingFromFavouriteService(id, req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Listing removed from favourites",
    });
  } catch (error) {
    return next(error);
  }
};
