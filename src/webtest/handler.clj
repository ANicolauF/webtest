(ns webtest.handler
  (:use compojure.core
        ring.middleware.json)
  (:require [compojure.handler :as handler]
            [environ.core :refer [env]]
            [compojure.route :as route]
            [ring.util.response :refer [response]]
            [webtest.auth :refer [auth-backend authenticated-user unauthorized-handler]]
            [buddy.auth.middleware :refer [wrap-authentication wrap-authorization]]
            [buddy.auth.accessrules :refer [restrict]]))

(defn- get-user [{{:keys [id]} :params {:strs [x-session]} :headers}]
  (let [user {:id id :firstname "Javier" :email "javier.amore@wws-tech.eu"}]
  (println "get user " user)
  {:status 200 :body user}))

(defn- update-user [{{:keys [id]} :params {:strs [x-session]} :headers {:keys [name email]} :body}]
  (println "update user")
  {:status 200 :body "ok"})

(defn- create-user [{user :body}]
(let [response (assoc user :id 1)]
  (println response)
  {:status 200 :body response}))

(defn- delete-user [{{:keys [id]} :params {:strs [x-session]} :headers}]
  {:status 200 :body "ok"})

(defroutes app-routes
  ;;INDEX
  (context "/" []
    (GET "/" [] (ring.util.response/file-response "index.html" {:root "public"}))
    (route/resources "/"))

  (context "/user" []
    (POST "/" [] create-user)
    (context "/:id" [id]
     (GET "/" [] get-user)
     (restrict
       (routes
         (PUT "/" [] update-user)
         (DELETE "/" [] delete-user))
         {:handler authenticated-user
          :on-error unauthorized-handler
          })))

  (route/not-found (response {:message "Page not found"})))

(def app
  (-> app-routes
      (wrap-authentication auth-backend)
      (wrap-authorization auth-backend)
      wrap-json-response
      (wrap-json-body {:keywords? true})))
