package main

import (
	"github.com/joho/godotenv"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

func main() {
	// .envファイルを読み込む
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Growiのアドレス
	growiAddress := os.Getenv("GROWI_URL")
	if growiAddress == "" {
		log.Fatal("GROWI_URL is not set")
	}
	growiURL, err := url.Parse(growiAddress)
	if err != nil {
		log.Fatal(err)
	}

	// GPU statのURL
	gpuStatURL := os.Getenv("API_URL")
	if gpuStatURL == "" {
		log.Fatal("API_URL is not set")
	}

	// リバースプロキシを作成
	growiProxy := httputil.NewSingleHostReverseProxy(growiURL)

	// ルーティングハンドラ
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// /__gpustat__ へのリクエストは指定URLからJSONを取得して返す
		if strings.HasPrefix(r.URL.Path, "/__gpustat__") {
			resp, err := http.Get(gpuStatURL)
			if err != nil {
				http.Error(w, "Error fetching GPU stats", http.StatusInternalServerError)
				log.Println("Error fetching GPU stats:", err)
				return
			}
			defer resp.Body.Close()

			// コンテンツタイプを設定
			w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))

			// レスポンスボディをクライアントにコピー
			_, err = io.Copy(w, resp.Body)
			if err != nil {
				http.Error(w, "Error writing response", http.StatusInternalServerError)
				log.Println("Error writing response:", err)
			}
		} else {
			// その他はGrowiへ
			growiProxy.ServeHTTP(w, r)
		}
	})

	log.Println("Reverse proxy server starting on :3001")
	log.Fatal(http.ListenAndServe(":3001", nil))
}
