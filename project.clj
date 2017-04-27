(defproject instadeq-panel "0.1.0-SNAPSHOT"
  :description "Web Test"
  :url "https://bitbucket.org/andre/webtest"
  :license {:name "MIT"
            :url "http://opensource.org/licenses/MIT"}
  :dependencies [[org.clojure/clojure "1.8.0"]
                 [ring/ring-core "1.6.0-RC1"]
                 [ring/ring-jetty-adapter "1.6.0-RC1"]
                 [compojure "1.5.2"]
                 [cheshire "5.7.0"]
                 ;[prachetasp/stripe-clojure "1.0.0"]
                 [clojurewerkz/elephant "1.0.0-beta18"]
                 [ring/ring-json "0.4.0"]
                 [environ "1.1.0"]
                 [buddy/buddy-hashers "1.2.0"]
                 [buddy/buddy-auth "1.2.0"]
                 [clj-jwt "0.1.1"]
                 [clj-http "3.4.1"]]

  ; The lein-ring plugin allows us to easily start a development web server
  ; with "lein ring server". It also allows us to package up our application
  ; as a standalone .jar or as a .war for deployment to a servlet contianer
  :plugins [[lein-ring "0.11.0"]
            [lein-environ "1.1.0"]]

  ; See https://github.com/weavejester/lein-ring#web-server-options for the
  ; various options available for the lein-ring plugin 
  :ring {:handler webtest.handler/app
         :nrepl {:start? true
                 :port 9998}}

  :profiles
  {:dev {:dependencies [[javax.servlet/servlet-api "2.5"]
                        [ring-mock "0.1.5"]]
         ; Since we are using environ, we can override these values with
         ; environment variables in production.
         :env {:db-url "oracle"}}
   :test {
          :env {:db-url "h2"}}})
