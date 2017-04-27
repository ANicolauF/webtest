(ns webtest.handler-test
  (:use clojure.test
        webtest.test-core
        ring.mock.request
        webtest.handler)
  (:require [cheshire.core :as json]
            [environ.core :refer [env]]))

(defn setup-db []
  (let [db-url (env :db-url)]
  (println "setup db " db-url "?")))

; before executing the tests, validate the plans exists
(defn with-db [f]
  (setup-db)
  (f)
)

;; register fixtures
(use-fixtures :once with-db)

(deftest main-routes
  (testing "not-found route"
    (let [response (app (request :get "/bogus-route"))]
      (is (= (:status response) 404))))
  (testing "get user"
    (let [response (app (request :get "/user/1"))
          body (json/parse-string (:body response))]
      (is (= (:status response) 200))
      (is (= (get-in body ["firstname"]) "Javier"))
      (is (= (get-in body ["email"]) "javier.amore@wws-tech.eu"))
      ))
)
