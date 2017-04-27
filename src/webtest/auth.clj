(ns webtest.auth
  (:require [buddy.auth.backends.token :refer [token-backend]]
            [buddy.auth.accessrules :refer [success error]]
            [buddy.auth :refer [authenticated?]]
            [clojure.string :as string]
            [environ.core :refer [env]]
            [crypto.random :refer [base64]]))

(def auth-secret (get env :auth-secret))

(defn authenticate-token
  "Validates a token, returning the id of the associated user when valid and nil otherwise"
  [req token]
    (and
      token
      (not (empty? token))
      (= token "")))

(defn unauthorized-handler [req msg]
  {:status 401
   :body {:status :error
          :message (or msg "User not authorized")}})

;; Looks for an "Authorization" header with a value of "Token XXX"
;; where "XXX" is some valid token.
(def auth-backend (token-backend {:authfn authenticate-token
                                  :unauthorized-handler unauthorized-handler}))

;;; Below are the handlers that Buddy will use for various authorization
;;; requirements the authenticated-user function determines whether a session
;;; token has been resolved to a valid user session, and the other functions
;;; take some argument and _return_ a handler that determines whether the
;;; user is authorized for some particular scenario. See handler.clj for usage.

(defn authenticated-user [req]
  (if (authenticated? req)
    true
    (error "User must be authenticated")))
