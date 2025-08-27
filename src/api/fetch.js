import url from './url';
import request from '@/utils/request';

// 註冊
export function signUp(data) {
  return request({
    url: `${url.user}/sign_up.php`,
    method: 'post',
    data,
  });
}

export function login(data) {
  return request({
    url: `${url.user}/login.php`,
    method: 'post',
    data,
  });
}

export function logout() {
  return request({
    url: `${url.user}/logout.php`,
    method: 'post',
  });
}

export function getUserProfile() {
  return request({
    url: `${url.member}/get_profile.php`,
    method: 'get',
  });
}

export function uploadAvatar(payload) {
  return request({
    url: `${url.member}/post_avatar.php`,
    method: 'post',
    data: payload,
  });
}

export function patchProfile(data) {
  return request({
    url: `${url.member}/patch_profile.php`,
    method: 'patch',
    data,
  });
}

export function patchPassword(data) {
  return request({
    url: `${url.member}/patch_password.php`,
    method: 'patch',
    data,
  });
}

export function getNotification() {
  return request({
    url: `${url.member}/get_notification.php`,
    method: 'get',
  });
}

export function getMyRecipe() {
  return request({
    url: `${url.member}/get_member_recipe.php`,
    method: 'get',
  });
}

export function postIngredients(payload) {
  return request({
    url: `${url.recipe}/post_ingredients.php`,
    method: 'post',
    data: payload,
  });
}


export function deleteRecipe(recipeId) {
  return request({
    method: 'delete',
    url: `${url.member}/delete_member_recipe.php`,
    data: {
      recipe_id: recipeId
    }
  });
}

export function getRecipeById(recipeId) {
  return request({
    method: 'get',
    url: `${url.member}/get_recipe_by_id.php?recipe_id=${recipeId}`,
  });
}

export function getRecipeCategory() {
  return request({
    url: `${url.recipe}/get_recipe_category.php`,
    method: 'get',
  });
}

export function getRecipe(data) {
  return request({
    url: `${url.recipe}/get_recipe.php`,
    method: 'get',
    data,
  });
}

export function getProductCategory() {
  return request({
    url: `${url.product}/get_product_category.php`,
    method: 'get',
  });
}

export function getProduct(params) {
  return request({
    url: `${url.product}/get_product.php`,
    method: 'get',
    params: params,
  });
}

export function getCarts() {
  return request({
    url: `${url.cart}/get_carts.php`,
    method: 'get',
  });
}

export function postCart(data) {
  return request({
    url: `${url.cart}/post_cart.php`,
    method: 'post',
    data,
  });
}

export function patchCart(data) {
  return request({
    url: `${url.cart}/patch_cart.php`,
    method: 'patch',
    data,
  });
}

export function deleteCart(data) {
  return request({
    url: `${url.cart}/delete_cart.php`,
    method: 'delete',
    data,
  });
}

export function deleteCarts(data) {
  return request({
    url: `${url.cart}/delete_carts.php`,
    method: 'delete',
    data,
  });
}

export function getOrders() {
  return request({
    url: `${url.order}/get_orders.php`,
    method: 'get',
  });
}

export function getOrderItem(data) {
  return request({
    url: `${url.order}/get_order_items.php?order_id=${data.order_id}`,
    method: 'get',
  });
}

export function postOrder(data) {
  return request({
    url: `${url.order}/post_order.php`,
    method: 'post',
    data,
  });
}

export function patchOrder(data) {
  return request({
    url: `${url.order}/patch_order.php`,
    method: 'patch',
    data,
  });
}

export function postLineLogin(data){
  return request({
    url:`${url.member}/line_login_callback.php`,
    method:'post',
    data,
  })
}
