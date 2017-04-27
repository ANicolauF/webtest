;; Common utilities to use across tests
(ns webtest.test-core
  (:use clojure.test))

(defn substring? [sub st]
  (if (nil? st)
    false
    (not= (.indexOf st sub) -1)))
